export interface ReminderInterface {
  id?: string;
  title: string;
  description?: string;
  duration?: number;
  createdAt?: Date;
  priority?: number;
  reminder?: boolean;
  timeLeft?: number;
  dueDate?: Date;
  category?: string;
  tags?: string[];
  completed?: boolean;
  completedAt?: Date;
  isOverdue?(): boolean;
  extendTime?(minutes: number): void;
  delete?(): void;
}


export interface PreferenceInterface {
  theme?: string;
  showReminder?: boolean;
  stickyBlob?: boolean;
  hideBlob?: boolean;
  showTime?: boolean;
  showDate?: boolean;
  sprintTiming?: number;
  blobPosition?: {
    left: string;
    top: string;
  };

  timeLeft? : number; //!===== tbc
  reminder?: string; //! ==== same as single reminder from the array TBC
  isActive?: boolean; //! ==== tbc
}
//? ========= all three ! are added to remove errors over context ------ TBC!!!