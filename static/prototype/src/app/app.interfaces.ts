export interface ITopic {
  id: number;
  keyword: string;
  count: number;
}

export interface IPerson {
  id: string;
  name: string;
  lastname: string;
  date_of_birth: string;
  date_of_death: string;
  count: number;
}

export interface IYear {
  year: number;
  count: number;
}

export interface IItem {
  id: string;
  name: string;
  lastname: string;
  title: string;
  publisher: Array<string>;
  year: number;
  height: number;
}

export interface INetworkLink {
  source: string;
  target: string;
  strength: number;
}
