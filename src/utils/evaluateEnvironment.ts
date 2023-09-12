export const evaluateEnvironment = (RunnerObject: any) => {
  if (!RunnerObject) return "unknown";

  // Runner Has Implemented all methods required of a "Content Source"
  if (
    RunnerObject.getContent &&
    RunnerObject.getChapters &&
    RunnerObject.getChapterData
  )
    return "source";

  // Runner Has Implemented all methods required of a "Content Tracker"

  if (
    RunnerObject.didUpdateLastReadChapter &&
    RunnerObject.getResultsForTitles &&
    RunnerObject.getTrackItem &&
    RunnerObject.beginTracking &&
    RunnerObject.getEntryForm &&
    RunnerObject.didSubmitEntryForm
  )
    return "tracker";

  // Runner author lacks a few brain cells
  return "unknown";
};
