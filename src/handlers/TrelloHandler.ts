import axios from 'axios'
import {IBoard, ICard, IList, ICheckItem, IAttachment} from '../entities/trello';
import {Poster, PosterTypes} from '../entities/Poster';
import * as fs from "fs";

export let _settings: object;
let savedImages: string[] = [];

/**
 * Update the current settings object. This function takes some time to execute, so it should not implement some
 * form of caching to prevent a too high load on the server
 */
export async function updateSettings(): Promise<void> {
  // Trello API endpoint
  const baseUrl = 'https://api.trello.com/1/';
  const config = {
    params: {
      lists: 'open',
      cards: 'open',
      card_checklists: 'all',
      labels: 'all',
      token: process.env.TRELLO_TOKEN,
      key: process.env.TRELLO_KEY,
    }
  }
  // Get the complete Trello board object. It is pretty big
  const board = (await axios.get(baseUrl + 'boards/' + process.env.TRELLO_BOARD_ID, config)).data as IBoard;

  // Then, create an empty mapping object for the lists
  const lists = {} as Record<string, IList>;
  // Create a mapping from list names to list ID's
  board.lists.forEach(function (list: IList) {
    lists[list.name] = list;
  });

  // Prepare some beautiful variables that need to be used later
  const baseList = lists['BasePosters'];
  const posters = [] as Poster[];
  const cardsInBaseList = board.cards.filter(card => card.idList === baseList.id);
  const newlySavedImages: string[] = [];

  /**
   * Download a file and save it with the given filename in the /data/ directory
   * @param {string} fileUrl - location of the to be downloaded file
   * @param {string} fileName - new name of the file
   */
  async function downloadImageFiles(fileUrl: string, fileName: string): Promise<void> {
    return axios.get(fileUrl, {responseType: 'stream'}).then(response => {

      //ensure that the user can call `then()` only when the file has
      //been downloaded entirely.

      return new Promise((resolve, reject) => {
        const fileWriter = fs.createWriteStream('data/' + fileName);
        response.data.pipe(fileWriter);
        let error: Error = null;
        fileWriter.on('error', err => {
          error = err;
          fileWriter.close();
          reject(err);
        });
        fileWriter.on('close', () => {
          if (!error) {
            resolve();
          }
          //no need to call the reject here, as it will have been called in the
          //'error' stream;
        });
      });
    });
  }

  /**
   * Given a card, get all the attachments and save only the images to the disk
   * @param {string} cardId - ID of the card. Used to download all attachment objects from the Trello API
   */
  async function findAndSaveAttachments(cardId: string): Promise<string[]> {
    // Download all attachments and save them in a variable
    const attachments = (await axios.get(baseUrl + `cards/${cardId}/attachments`, {
      params: {
        token: process.env.TRELLO_TOKEN,
        key: process.env.TRELLO_KEY,
      }
    })).data as IAttachment[];

    // Create an empty array to store all saved image location URLs
    let result: string[] = [];
    // For each attachment in the list of attachments...
    for (const attachment of attachments) {
      // Create the filename with the correct extension
      let fileName: string;
      if (attachment.mimeType === 'image/png') {
        fileName = attachment.id + '.png'
      } else if (attachment.mimeType === 'image/jpeg') {
        fileName = attachment.id + '.jpeg'
      } else if (attachment.mimeType === 'image/gif') {
        fileName = attachment.id + '.gif'
      } else {
        // The filetype is not supported and therefore we skip this attachment
        continue;
      }

      // Download this image and wait for it to complete
      await downloadImageFiles(attachment.url, fileName);
      // Save the filename in the newly saved images array, used to delete unused attachments
      newlySavedImages.push(fileName);
      // Put this image URL in the resulting array
      result.push('data/' + fileName);
    }
    return result;
  }

  /**
   * Remove unused attachments. This function uses the global variable "savedImages" and local variable
   * "newlySavedimages". All items that are in the former array, but not in the latter, will be removed.
   */
  function removeUnusedAttachments(): void {
    const diff = savedImages.filter(x => !newlySavedImages.includes(x));
    diff.forEach(function (file) {
      fs.unlinkSync('data/'+ file);
    })
    // Set the global variable with the current list of images
    savedImages = newlySavedImages;
  }

  /**
   * Recursive function to parse a list of card to poster objects.
   * This function is recursive, because it allows cards in a list to refer to another list
   * This in turn allows for a better ordering of posters and allows e.g. photo posters to be in the list more than once
   * @param {ICard[]} cards - List of cards that we have to loop over
   * @param {string} types - The types of posters that are in this list of cards (e.g. 'img', 'extern' or 'photo')
   */
  async function parseListToPosters(cards: ICard[], types: string) {
    let card;
    for (let i = 0; i < cards.length; i++) {
      card = cards[i]
      // A card can be two things: a poster, or a reference to a new list of cards.
      // If it has the correct label ("Posterlist"), it means the card is a reference to a list
      if (card.labels.findIndex(label => label.name === 'Posterlist') > -1) {
        // Find the new list object by looking for it in the mapping of lists.
        // The name of the card should equal the name of the list
        const newList = lists[card.name];
        // Find all cards that belong in this list.
        const newCards = board.cards.filter(newCard => newCard.idList === newList.id);
        // The description of the card should contain the type of the list
        const newTypes = card.desc;
        // Recursion!!! Yay!!!
        await parseListToPosters(newCards, newTypes);

      } else {
        // Create an empty poster object
        const poster = {} as Poster;
        // Set the name and due date of the card
        poster.name = card.name;
        poster.due = card.due;
        // Set the default timeout to 15 seconds
        poster.timeout = 5;
        // Set the default progress bar to 'full'
        poster.footer = 'full';

        // If there are labels, set the label of this poster to be the first label of the card
        if (card.labels.length > 0) {
          poster.label = card.labels[0].name;
        // If there is no label, we simply keep the label empty
        } else {
          poster.label = '';
        }
        // Create an empty array for the source strings/URLs
        poster.source = [];

        // If the poster type is an image...
        if (types === 'img') {
          // Get the source list from saving the attachments to disk
          poster.source = await findAndSaveAttachments(card.id);
          // Set the poster type to image
          poster.type = 'image' as PosterTypes;

        // If the poster type is an external (iframe) poster...
        } else if (types === 'extern') {
          // Set the source to be the description of the card
          poster.source = [card.desc];
          // Set the type to external
          poster.type = PosterTypes.external;

        // If the poster type is a photo poster...
        } else if (types === 'photo') {
          // Find the checklist called "photos", that should contain the album ids
          const index = card.checklists.findIndex(checklist => checklist.name.toLowerCase() === 'photos');
          // If such list cannot be found, it does not exist. Throw an error because we cannot continue
          if (index < 0) { throw new TypeError(`Photo card (${card.name}) has no checklist named "photos"`) }
          // Get the checklist for the albums
          const checkList = card.checklists[index];
          let albumItem;
          let albumId;
          // For each item in this checklist (aka: each album)...
          checkList.checkItems.forEach(function (item: ICheckItem) {
            // Set the item object
            albumItem = item.name;
            // Get the first word of this name, the ID
            albumId = albumItem.split(' ')[0];
            // add this ID to the list
            poster.source.push(albumId);
          })
          // Set the type to Photo
          poster.type = 'photo' as PosterTypes;

        // If the poster is not of one of the above type...
        } else {
          // It must be a special implemented poster, so set the type to be the description of the card
          poster.type = card.desc as PosterTypes;
        }

        // Find the index of the "timeout" checklist if it exists
        const indexTimeout = card.checklists.findIndex(checklist => checklist.name.toLowerCase() === 'timeout')
        // If it does exist, take the value of the first checkbox and make it the timeout value
        if (indexTimeout > -1) {
          poster.timeout = parseInt(card.checklists[indexTimeout].checkItems[0].name);
        }

        // If the label "HIDE_BORDER" is attached to this card, set the footer to 'minimal'
        if (card.labels.findIndex(label => label.name === 'HIDE_BORDER') > -1) {
          poster.footer = 'minimal';
        }

        // Add this poster to the list of final posters.
        posters.push(poster);
      }
    }
  }

  // First call to the recursive parse function with the baseList
  await parseListToPosters(cardsInBaseList, 'base')
  // Clean the disk of image posters that are not used anymore
  removeUnusedAttachments();
  // Put this list of posters in the settings object
  _settings = {posters: posters};
}
