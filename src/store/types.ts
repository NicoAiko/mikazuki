import { IAniListSession, IAniListMediaListCollection, IAniListActivity } from '../types';

export interface RootState {
  app: AppState;
  aniList: AniListState;
  userSettings: UserSettingsState;
}

export interface AppState {
  _locale: string;
  _darkMode: boolean;
  _loading: boolean;
  _navigationDrawerListItemColor: string;
  _navigationDrawerBackgroundBrightness: number;
  _navigationDrawerBackgroundBlurriness: number;
  _listItemForceDisableAnimationAmount: number;
  _listItemStartAmount: number;
}

export interface UserSettingsState {
  _matomoConsent: boolean | null;
  _refreshRate: number;
  _session: IAniListSession;
}

export interface AniListState {
  _aniListData: IAniListMediaListCollection;
  _latestActivities: IAniListActivity[];
  _currentMediaTitle: string;
}
