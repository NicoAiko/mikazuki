import axios from './connection';
import store from '@/store';

// #region AniList Types
import {
  AniListSeason,
  AniListType,
  IAniListMediaListCollection,
  IAniListSeasonPreview,
  IAniListSeasonPreviewMedia,
  IAniListUser,
  IAniListMedia,
  IAniListEntry,
  AniListListStatus,
  IAniListSearchResult,
  IAniListActivity,
  IAniListMediaDate,
  IAniListUserStats,
  IAniListUserStatistics,
  AniListUserTitleLanguage,
  AniListScoreFormat,
} from '@/types';
// #endregion

// #region Queries
import getAnimeInfo from './queries/getAnimeInfo.graphql';
import getListEntry from './queries/getListEntry.graphql';
import getUserList from './queries/getUserList.graphql';
import getUser from './queries/getUser.graphql';
import getLatestActivities from './queries/getLatestActivities.graphql';
import getUserStatistics from './queries/getUserStatistics.graphql';
import getSeasonPreview from './queries/getSeasonPreview.graphql';
import searchAnime from './queries/searchAnime.graphql';
import getActivity from './queries/getActivity.graphql';
// #endregion

// #region Mutations
import addEntry from './mutations/addEntry.graphql';
import updateEntry from './mutations/updateEntry.graphql';
import removeEntry from './mutations/removeEntry.graphql';
import updateUserTitleLanguage from './mutations/updateUserTitleLanguage.graphql';
import updateScoringFormat from './mutations/updateScoringFormat.graphql';
import updateShowExplicitContent from './mutations/updateShowExplicitContent.graphql';
import toggleLike from './mutations/toggleLike.graphql';
import saveActivityReply from './mutations/saveActivityReply.graphql';
// #endregion

// #region Responses
import {
  UserListResponse,
  UserResponse,
  SeasonPreviewResponse,
  MediaResponse,
  SearchResponse,
  LatestActivitiesResponse,
} from './responses';
// #endregion

interface SearchFilters {
  isAdult?: boolean;
  onList?: boolean;
}

interface ActivitiesParams {
  page: number;
  perPage: number;
  isFollowing?: boolean;
}

interface AddEntryParams {
  mediaId: number;
  status: AniListListStatus;
  score?: number;
  progress?: number;
}

interface UpdateEntryParams {
  entryId: number;
  progress: number;
  score?: number;
  status?: AniListListStatus;
  startedAt?: IAniListMediaDate;
  completedAt?: IAniListMediaDate;
}

export default class AniListAPI {
  public async getUserList(userName: string, type: AniListType): Promise<IAniListMediaListCollection> {
    const response = await axios.post<UserListResponse>('/', {
      query: getUserList,
      variables: {
        userName,
        type,
      },
    });

    return response.list;
  }

  public async getUser(): Promise<IAniListUser> {
    const response = await axios.post<UserResponse>('/', { query: getUser });

    return response.user;
  }

  public async getLatestActivities(
    userId: number,
    { page, perPage, isFollowing }: ActivitiesParams = { page: 1, perPage: 10, isFollowing: true }
  ): Promise<IAniListActivity[]> {
    const response = await axios.post<LatestActivitiesResponse>('/', {
      query: getLatestActivities,
      variables: {
        userId,
        page,
        perPage,
        isFollowing,
      },
    });

    return response.page.activities;
  }

  public async getUserStatistics(): Promise<{ stats: IAniListUserStats; statistics: IAniListUserStatistics }> {
    const response = await axios.post<UserResponse>('/', {
      query: getUserStatistics,
    });

    return {
      stats: response.user.stats,
      statistics: response.user.statistics,
    };
  }

  public async getSeasonPreview(seasonYear: number, season: AniListSeason): Promise<IAniListSeasonPreview> {
    const mediaItems: IAniListSeasonPreviewMedia[] = [];
    let page = 1;
    let tmp = true;

    while (tmp) {
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.post<SeasonPreviewResponse>('/', {
        query: getSeasonPreview,
        variables: {
          season,
          seasonYear,
          page,
        },
      });

      const { media } = response.page;

      if (!media.length || media.length < 50) {
        tmp = false;
      }

      mediaItems.push(...media);
      page += 1;
    }

    return {
      season,
      seasonYear,
      media: mediaItems,
    };
  }

  public async getAnimeInfo(id: number): Promise<IAniListMedia> {
    const response = await axios.post<MediaResponse<IAniListMedia>>('/', {
      query: getAnimeInfo,
      variables: { id },
    });

    return response.media;
  }

  public async getListEntryByMediaId(mediaId: number): Promise<IAniListEntry> {
    const { id: userId } = store.state.userSettings._session.user;

    const response = await axios.post<MediaResponse<IAniListEntry>>('/', {
      query: getListEntry,
      variables: { mediaId, userId },
    });

    return response.media;
  }

  public async searchAnime(query: string, { onList, isAdult }: SearchFilters): Promise<IAniListSearchResult[]> {
    const params = {
      query,
      type: AniListType.ANIME,
      onList,
      isAdult,
    };

    const response = await axios.post<SearchResponse>('/', {
      query: searchAnime,
      variables: params,
    });

    return response.page.media;
  }

  public async getActivity(id: number): Promise<IAniListActivity> {
    const response = await axios.post('/', {
      query: getActivity,
      variables: { id },
    });

    return response.activity;
  }

  public async addEntry({ mediaId, status, score, progress }: AddEntryParams): Promise<IAniListEntry> {
    const response = await axios.post<MediaResponse<IAniListEntry>>('/', {
      query: addEntry,
      variables: {
        mediaId,
        status,
        score,
        progress,
      },
    });

    return response.media;
  }

  public async updateEntry({
    entryId,
    progress,
    score,
    status,
    startedAt,
    completedAt,
  }: UpdateEntryParams): Promise<IAniListEntry> {
    const response = await axios.post<MediaResponse<IAniListEntry>>('/', {
      query: updateEntry,
      variables: {
        entryId,
        progress,
        score,
        status,
        startedAt,
        completedAt,
      },
    });

    return response.media;
  }

  public async removeEntry(entryId: number): Promise<void> {
    await axios.post('/', {
      query: removeEntry,
      variables: { entryId },
    });
  }

  public async updateUserTitleLanguage(language: AniListUserTitleLanguage): Promise<AniListUserTitleLanguage> {
    const response = await axios.post<UserResponse>('/', {
      query: updateUserTitleLanguage,
      variables: { language },
    });

    return response.user.options.titleLanguage;
  }

  public async updateScoringFormat(value: AniListScoreFormat): Promise<AniListScoreFormat> {
    const response = await axios.post<UserResponse>('/', {
      query: updateScoringFormat,
      variables: { value },
    });

    return response.user.mediaListOptions.scoreFormat;
  }

  public async updateShowExplicitContent(value: boolean): Promise<boolean> {
    const response = await axios.post<UserResponse>('/', {
      query: updateShowExplicitContent,
      variables: { value },
    });

    return response.user.options.displayAdultContent;
  }

  // TODO: Add proper typing
  public async toggleLike(id: number, type: any): Promise<any> {
    const response = await axios.post('/', {
      query: toggleLike,
      variables: { id, type },
    });

    return response.activity;
  }

  // TODO: Add proper typing
  public async saveActivityReply(activityId: number, text: string, id?: number): Promise<any> {
    const response = await axios.post('/', {
      query: saveActivityReply,
      variables: { activityId, text, id },
    });

    return response.activity;
  }
}
