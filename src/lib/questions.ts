import { format, subDays } from 'date-fns';

export interface Question {
  id: string;
  sentence: string;
  answer: string;
}

const ALL_QUESTIONS: Question[] = [
  { id: '1', sentence: 'I am very ___ about learning new technologies.', answer: 'excited' },
  { id: '2', sentence: 'Could you please ___ the meeting for tomorrow?', answer: 'schedule' },
  { id: '3', sentence: 'We need to ___ this issue as soon as possible.', answer: 'resolve' },
  { id: '4', sentence: 'Thank you for your ___ response.', answer: 'prompt' },
  { id: '5', sentence: 'I look forward to ___ from you soon.', answer: 'hearing' },
  { id: '6', sentence: 'Please find the ___ document for your review.', answer: 'attached' },
  { id: '7', sentence: 'Let me know if you have any ___ regarding this matter.', answer: 'questions' },
  { id: '8', sentence: 'We are currently ___ a new software engineer.', answer: 'hiring' },
  { id: '9', sentence: 'The project deadline has been ___ to next Friday.', answer: 'extended' },
  { id: '10', sentence: 'I am writing to ___ about the status of my application.', answer: 'inquire' },
  { id: '11', sentence: 'Our team is ___ to delivering high-quality results.', answer: 'committed' },
  { id: '12', sentence: 'Could you provide an ___ on the project progress?', answer: 'update' },
  { id: '13', sentence: 'We appreciate your ___ in this matter.', answer: 'cooperation' },
  { id: '14', sentence: 'Please ___ that you have received this email.', answer: 'confirm' },
  { id: '15', sentence: 'I will ___ up with you next week.', answer: 'follow' },
  { id: '16', sentence: 'The meeting has been ___ due to unforeseen circumstances.', answer: 'canceled' },
  { id: '17', sentence: 'We need to ___ our strategy for the upcoming quarter.', answer: 'discuss' },
  { id: '18', sentence: 'Thank you for bringing this to my ___.', answer: 'attention' },
  { id: '19', sentence: 'I am ___ available for a call tomorrow afternoon.', answer: 'currently' },
  { id: '20', sentence: 'Please let me know your ___ for a brief meeting.', answer: 'availability' },
];

export const getDailyQuestions = (): Question[] => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const startIndex = (dayOfYear * 5) % ALL_QUESTIONS.length;
  const questions: Question[] = [];
  
  for (let i = 0; i < 5; i++) {
    questions.push(ALL_QUESTIONS[(startIndex + i) % ALL_QUESTIONS.length]);
  }
  
  return questions;
};
