export interface Character {
  id: string
  name: string
  country: string
  party?: string
  bio: string
  wiki: string
  portrait?: string
}

export const initialLeaders: Character[] = [
  // Key American figures
  {
    id: 'fdr',
    name: 'Franklin D. Roosevelt',
    country: 'United States',
    party: 'Democratic',
    bio: 'Incumbent 32nd president seeking re-election in 1936, pushing an expanded New Deal as the nation slowly recovers from the Depression.',
    wiki: 'Franklin_D._Roosevelt'
  },
  {
    id: 'landon',
    name: 'Alf Landon',
    country: 'United States',
    party: 'Republican',
    bio: "Kansas governor mounting a 1936 challenge to FDR on a platform of fiscal restraint and states' rights.",
    wiki: 'Alf_Landon'
  },
  {
    id: 'willkie',
    name: 'Wendell Willkie',
    country: 'United States',
    party: 'Republican',
    bio: 'Utility executive and New Deal critic whose business career in 1936 would later catapult him into the 1940 presidential race.',
    wiki: 'Wendell_Willkie'
  },
  {
    id: 'dewey',
    name: 'Thomas E. Dewey',
    country: 'United States',
    party: 'Republican',
    bio: 'Manhattan district attorney famed for taking on organized crime, emerging as a rising Republican star by 1936.',
    wiki: 'Thomas_E._Dewey'
  },
  {
    id: 'truman',
    name: 'Harry S. Truman',
    country: 'United States',
    party: 'Democratic',
    bio: 'Freshman senator from Missouri tied to the Pendergast machine, still little-known nationally in 1936.',
    wiki: 'Harry_S._Truman'
  },
  {
    id: 'garner',
    name: 'John Nance Garner',
    country: 'United States',
    party: 'Democratic',
    bio: "Texan vice president and former Speaker balancing FDR's reform agenda with conservative Democrats.",
    wiki: 'John_Nance_Garner'
  },
  {
    id: 'hull',
    name: 'Cordell Hull',
    country: 'United States',
    party: 'Democratic',
    bio: 'Veteran congressman turned Secretary of State pursuing reciprocal trade deals to revive the world economy.',
    wiki: 'Cordell_Hull'
  },
  {
    id: 'morgenthau',
    name: 'Henry Morgenthau Jr.',
    country: 'United States',
    party: 'Democratic',
    bio: 'Treasury secretary overseeing federal financing of relief projects and stabilizing gold inflows in 1936.',
    wiki: 'Henry_Morgenthau_Jr.'
  },
  {
    id: 'wallace',
    name: 'Henry A. Wallace',
    country: 'United States',
    party: 'Democratic',
    bio: 'Progressive Iowa farm editor serving as Secretary of Agriculture, championing crop supports under the New Deal.',
    wiki: 'Henry_A._Wallace'
  },
  {
    id: 'hopkins',
    name: 'Harry Hopkins',
    country: 'United States',
    party: 'Democratic',
    bio: 'Key New Deal aide running the Works Progress Administration and providing FDR with political counsel.',
    wiki: 'Harry_Hopkins'
  },

  // Prominent world leaders
  {
    id: 'churchill',
    name: 'Winston Churchill',
    country: 'United Kingdom',
    party: 'Conservative',
    bio: 'British backbencher warning of German rearmament while outside the 1936 government.',
    wiki: 'Winston_Churchill'
  },
  {
    id: 'baldwin',
    name: 'Stanley Baldwin',
    country: 'United Kingdom',
    party: 'Conservative',
    bio: 'Prime minister navigating abdication turmoil and appeasement debates in early 1936.',
    wiki: 'Stanley_Baldwin'
  },
  {
    id: 'stalin',
    name: 'Joseph Stalin',
    country: 'Soviet Union',
    party: 'Communist',
    bio: 'Soviet ruler deep into the Second Five-Year Plan and beginning the Great Purge by 1936.',
    wiki: 'Joseph_Stalin'
  },
  {
    id: 'hitler',
    name: 'Adolf Hitler',
    country: 'Germany',
    party: 'Nazi',
    bio: 'Führer consolidating power after the remilitarization of the Rhineland in 1936.',
    wiki: 'Adolf_Hitler'
  },
  {
    id: 'mussolini',
    name: 'Benito Mussolini',
    country: 'Italy',
    party: 'Fascist',
    bio: 'Il Duce pursuing empire through the ongoing invasion of Ethiopia and tightening ties with Nazi Germany.',
    wiki: 'Benito_Mussolini'
  },
  {
    id: 'degaulle',
    name: 'Charles de Gaulle',
    country: 'France',
    party: 'Republican',
    bio: 'French armored warfare advocate and colonel whose ideas are ignored by the 1936 high command.',
    wiki: 'Charles_de_Gaulle'
  },
  {
    id: 'chiang',
    name: 'Chiang Kai-shek',
    country: 'China',
    party: 'Nationalist',
    bio: 'Nationalist generalissimo balancing war with Chinese communists and rising Japanese aggression in 1936.',
    wiki: 'Chiang_Kai-shek'
  },
  {
    id: 'hirohito',
    name: 'Emperor Hirohito',
    country: 'Japan',
    bio: 'Symbolic emperor presiding over a militarized Japan embarking on expansion across Asia.',
    wiki: 'Hirohito'
  },
  {
    id: 'selassie',
    name: 'Haile Selassie',
    country: 'Ethiopia',
    bio: 'Ethiopian emperor resisting the Italian invasion during the 1935–1936 war.',
    wiki: 'Haile_Selassie'
  }
]
