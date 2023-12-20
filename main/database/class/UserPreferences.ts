export default class UserPreferences {
  id: number;
  GamePathLive: string;
  GamePathPtu: string;
  GamePathEptu: string;
  GamePathTechPreview: string;
  lastUpdate: Date;
  UiPreferences: string;

  constructor(
      id: number,
      GamePathLive: string,
      GamePathPtu: string,
      GamePathEptu: string,
      GamePathTechPreview: string,
      lastUpdate: Date,
      UiPreferences: Record<string, any>
  ) {
      this.id = id;
      this.GamePathLive = GamePathLive;
      this.GamePathPtu = GamePathPtu;
      this.GamePathEptu = GamePathEptu;
      this.GamePathTechPreview = GamePathTechPreview;
      this.lastUpdate = lastUpdate;
      this.UiPreferences = JSON.stringify(UiPreferences);
  }
}
