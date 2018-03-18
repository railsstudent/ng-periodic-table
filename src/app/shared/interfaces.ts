export interface HighlightState {
  alkali: boolean;
  alkaline: boolean;
  lant: boolean;
  actinoids: boolean;
  transition: boolean;
  postTransition: boolean;
  metalloids: boolean;
  nonMetals: boolean;
  nobleGas: boolean;
};

export interface Atom {
  number: string,
  category: string,
  symbol: string,
  name: string,
  atomic_mass: number,
  phase: string,
  xpos: number,
  ypos: number
};
