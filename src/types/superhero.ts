export interface Superhero {
    id: string;
    name: string;
    picture: string; 
    attributes: {
      agility: number; 
      strength: number; 
      weight: number; 
      endurance: number; 
      charisma: number; 
    };
    createdAt: string; 
    updatedAt: string; 
  }