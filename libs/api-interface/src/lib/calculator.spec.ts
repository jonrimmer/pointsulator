import { calculateScores } from './calculator';
import {
  WeekDetailsDTO,
  TeamSheetDTO,
  AssetType,
  WeekAssetDTO,
  AssetEventType,
  ManagerRef,
  AssetDTO
} from './interfaces';

const JON: ManagerRef = {
  id: 1,
  name: 'Jon'
};

const A_KEEPER: AssetDTO = {
  id: 1,
  name: 'A. Keeper',
  type: AssetType.Goalkeeper,
  team: 'Liverpool'
};

const B_DEF = {
  id: 2,
  name: 'B. Defence',
  type: AssetType.Goalkeeper,
  team: 'Liverpool'
};

const C_MID = {
  id: 3,
  name: 'C. Midfield',
  type: AssetType.Midfielder,
  team: 'Liverpool'
};

const D_FORWARD = {
  id: 4,
  name: 'D. Forward',
  type: AssetType.Forward,
  team: 'Liverpool'
};

const teams: TeamSheetDTO[] = [
  {
    manager: JON,
    items: [
      {
        asset: A_KEEPER,
        substitute: false
      },
      {
        asset: B_DEF,
        substitute: false
      },
      {
        asset: C_MID,
        substitute: false
      },
      {
        asset: D_FORWARD,
        substitute: false
      }
    ],
    validFrom: null
  }
];

const before = [
  {
    manager: JON,
    points: 0
  }
];

function week(assets: WeekAssetDTO[]): WeekDetailsDTO {
  return {
    id: 1,
    teams,
    startDate: new Date(),
    scoreboard: {
      before
    },
    assets
  };
}

describe('calculator', () => {
  it('should add points for goals', () => {
    const scores = calculateScores(
      week([
        {
          assetId: A_KEEPER.id,
          didNotPlay: false,
          events: [
            {
              type: AssetEventType.Goal,
              count: 1,
              owner: JON
            }
          ]
        }
      ])
    );

    expect(scores).toEqual([
      {
        manger: JON,
        points: 4
      }
    ]);
  });
});
