export default `
mutation addAnimeToList($mediaId: Int!, $status: MediaListStatus!, $progress: Int!, $score: Float!) {
  SaveMediaListEntry(
    mediaId: $mediaId,
    status: $status,
    progress: $progress,
    score: $score
  ) {
    id
  }
}
`;
