import { updateSettings as trelloUpdate } from "./TrelloHandler";
import { Layouts, Settings } from "../entities/Settings";
import { shouldShowSnow } from "./DateHandler";

export let _settings: Settings;

export async function updateSettings() {
  _settings = await trelloUpdate();

  if (shouldShowSnow()) {
    _settings.screenEffect = 'snow';
  } else {
    _settings.screenEffect = '';
  }

  _settings.layout = Layouts.GEWIS;
  _settings.hash = undefined;
}
