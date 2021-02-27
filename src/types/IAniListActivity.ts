import { IAniListMedia } from './IAniListMedia';
import { AniListActivityType } from './AniListActivityType';
import { IAniListCoverImage } from './IAniListCoverImage';
import { IAniListUser } from './IAniListUser';

export interface IAniListActivity {
  /**
   * @var {number} id contains the activity id
   */
  id: number;
  /**
   * @var {IAniListMedia} media contains the activity's media information
   */
  media: IAniListMedia;
  /**
   * @var {IAniListUser} user contains user data
   */
  user: IAniListUser;
  /**
   * @var {string | null} progress contains the episode number or if completed is null
   */
  progress: string | null;
  /**
   * @var {string} status contains a string if "completed" or "watched episode"
   */
  status: string;
  /**
   * @var {AniListActivityType} type contains the activity type
   */
  type: AniListActivityType;
  /**
   * @var {number} createdAt contains the date of the activity as a timestamp
   */
  createdAt: number;
  /**
   * @var {IAniListCoverImage} coverImage contains data about the media's covers
   */
  coverImage: IAniListCoverImage;
  replyCount: number;
  likeCount: number;
  isLiked: boolean;
  isSubscribed: boolean;
  isLocked: boolean;
}
