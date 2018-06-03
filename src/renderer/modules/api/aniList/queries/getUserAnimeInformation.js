export default `query GetById($mediaId: Int!) {
  entry: Media(id: $mediaId) {
    mediaListEntry {
      id
      progress
      score
      status
      updatedAt
    }
    id
    title {
      romaji
      english
      native
      userPreferred
    }
    description(asHtml: true)
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    season
    status
    format
    type
    episodes
    isLicensed
    updatedAt
    coverImage {
      large
    }
    synonyms
    averageScore
    meanScore
    favourites
    isAdult
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
      mediaId
    }
    streamingEpisodes {
      title
      thumbnail
      url
      site
    }
  }
}`;
