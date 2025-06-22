import { FC } from "react";
import { SessionDescription } from "./SessionDescription";

type ControlMessage = {
  type: "control";
  controlType: "start-game";
  gameType: string;
  gameId: string;
};

type GameMessage<T = object> = {
  type: "game";
  payload: T;
};
type GameComponent = FC<{
  event: GameMessage | undefined;
  sendEvent: (_: GameMessage) => void;
  disabled: boolean;
  setPaneSize?: (width: number, height: number) => void;
  session: SessionDescription;
}>;

type GamePlayProps = {
  event: object | undefined;
  sendEvent: (_: object) => void;
  disabled: boolean;
  games: Record<string, GameComponent>;
  session: SessionDescription;
  setPaneSize?: (width: number, height: number) => void;
};

type GamePlayReturn = {
  GameComponent?: JSX.Element;
};

const isGameMessage = (obj: any): obj is GameMessage =>
  obj && obj.type === "game";

const isControlMessage = (obj: any): obj is ControlMessage =>
  obj && obj.type === "control";

export { isControlMessage, isGameMessage };
export type {
  ControlMessage,
  GameComponent,
  GameMessage,
  GamePlayProps,
  GamePlayReturn,
};
