export class Plugin {
  $dirty: boolean;
  pluginType: string;
  files: Object;

  constructor() {}

  fromJSON(json) {
    this.pluginType = json.pluginType;
    this.files = json.files;
    return this;
  }
}
