interface Message {
  id: string;
  text: string;
}

interface TrainingData {
  expressionCount?: number;
  expressions: Array<Message>;
}

export interface Intent {
  id: string;
  name: string;
  description: string;
  trainingData: TrainingData;
  reply: Message;
}