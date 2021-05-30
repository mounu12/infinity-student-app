export class User {
    id!: number;
    phoneNumber!: number;
    isdCode!: string;
    userName!: string;
    "email": string;
    password!: string;
    firstName!: string;
    lastName!: string;
    userCountry!: string;
    userType!: {
    id: number;
    type: string;
  };
    grade!: {
    id: number;
    gradeName: string;
    description: string;
  };
    board!: {
    id: number;
    boardName: string;
    description: string;
    boardimage: string;
  };
    targetexams!: any[];
    lastLoggedInTime!: number;
    profilePhoto!: string;
    isWhatsappConsent!: boolean;
    profileUpdated!: boolean;

  }