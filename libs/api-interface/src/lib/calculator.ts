import { WeekDetailsDTO, ScoreboardEntryDTO } from './interfaces';

export const calculateScores = (week: WeekDetailsDTO): ScoreboardEntryDTO[] => {
  const result = week.scoreboard.before.map(entry => ({ ...entry }));

  week.assets.forEach(asset => {});

  return result;
};
