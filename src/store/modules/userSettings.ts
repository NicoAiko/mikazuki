import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';
import { RootState, UserSettingsState } from '../types';
import { AniListScoreFormat, IAniListSession, IAniListUser, AniListUserTitleLanguage } from '@/types';

const defaultUser = {
  avatar: {
    medium: '',
    large: '',
  },
  bannerImage: '',
  id: -1,
  mediaListOptions: {
    scoreFormat: AniListScoreFormat.POINT_100,
  },
  name: '',
  stats: {
    watchedTime: 0,
    activityHistory: [],
  },
  options: {
    displayAdultContent: false,
    titleLanguage: AniListUserTitleLanguage.ROMAJI,
  },
  statistics: {
    anime: {
      count: 0,
      episodesWatched: 0,
      meanScore: 0,
      minutesWatched: 0,
      standardDeviation: 0,
      genres: [],
    },
    manga: {
      chaptersRead: 0,
      count: 0,
      meanScore: 0,
      standardDeviation: 0,
      volumesRead: 0,
    },
  },
};

const state: UserSettingsState = {
  _refreshRate: 15,
  _session: {
    accessToken: '',
    user: {
      ...defaultUser,
    },
  },
};

const getters: GetterTree<UserSettingsState, RootState> = {
  refreshRate(state): number {
    return state._refreshRate;
  },
  session(state): IAniListSession {
    return state._session;
  },
  accessToken(state): string {
    return state._session.accessToken;
  },
  isAuthenticated(state): boolean {
    return !!state._session.accessToken;
  },
  allowAdultContent(state): boolean {
    return state._session.user.options.displayAdultContent;
  },
  scoreFormat(state): AniListScoreFormat {
    return state._session.user.mediaListOptions.scoreFormat;
  },
  username(state): string {
    return state._session.user.name;
  },
};

const mutations: MutationTree<UserSettingsState> = {
  setSession(state, accessToken: string) {
    state._session.accessToken = accessToken;
  },
  setUser(state, data: IAniListUser) {
    state._session.user = data;
  },
  setRefreshRate(state, rate: number) {
    state._refreshRate = rate;
  },
  setUserTitleLanguage(state, language: AniListUserTitleLanguage) {
    state._session.user.options.titleLanguage = language;
  },
  setScoringFormat(state, value: AniListScoreFormat) {
    state._session.user.mediaListOptions.scoreFormat = value;
  },
  setShowExplicitContent(state, value: boolean) {
    state._session.user.options.displayAdultContent = value;
  },
};

const actions: ActionTree<UserSettingsState, RootState> = {
  async setSession({ commit }, payload: string): Promise<void> {
    commit('setSession', payload);

    return Promise.resolve();
  },
  async setUser({ commit }, payload: IAniListUser): Promise<void> {
    commit('setUser', payload);

    return Promise.resolve();
  },
  async setRefreshRate({ commit }, payload: number): Promise<void> {
    commit('setRefreshRate', payload);

    return Promise.resolve();
  },
  async setUserTitleLanguage({ commit }, payload: AniListUserTitleLanguage): Promise<void> {
    commit('setUserTitleLanguage', payload);

    return Promise.resolve();
  },
  async setScoringFormat({ commit }, payload: AniListScoreFormat): Promise<void> {
    commit('setScoringFormat', payload);

    return Promise.resolve();
  },
  async setShowExplicitContent({ commit }, payload: boolean): Promise<void> {
    commit('setShowExplicitContent', payload);

    return Promise.resolve();
  },
  async logout({ commit, dispatch }): Promise<void> {
    await dispatch('resetAllData', undefined, { root: true });

    return Promise.resolve();
  },
  async resetAllData({ commit }): Promise<void> {
    commit('setSession', '');
    commit('setUser', { ...defaultUser });
    commit('setRefreshRate', 15);
  },
};

const module: Module<UserSettingsState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default module;
