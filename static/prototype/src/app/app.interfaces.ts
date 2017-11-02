export interface ITopic {
  id: number;
  keyword: string;
  count: number;
}

export interface IPerson {
  id: string;
  name: string;
  lastname: string;
  count: number;
}

export interface IYear {
  year: number;
  count: number;
}

export interface IItem {
  author: string;
  title: string;
  verlag: string;
  year: number;
  height: number;
}
