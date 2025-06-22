import { FC, useEffect, useMemo, useState } from "react";
import {
  ControlMessage,
  GamePlayProps,
  isControlMessage,
  isGameMessage,
} from "./GamePlayTypes";

const pickRandomGame = (availableGames: string[]): string => {
  const randomIndex = Math.floor(Math.random() * availableGames.length);
  return availableGames[randomIndex];
};

const GamePlay: FC<GamePlayProps> = ({
  event,
  sendEvent,
  disabled,
  games,
  session,
  setPaneSize,
}) => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  // Handle incoming events
  useEffect(() => {
    console.log(`[Gameplay] event ${JSON.stringify(event)}`);

    if (isControlMessage(event)) {
      if (event.controlType === "start-game") {
        setCurrentGame(event.gameType);
        setGameId(event.gameId);
      }
    }
  }, [event]);

  // Handle disabled state changes
  useEffect(() => {
    if (!disabled && session.isHost && !currentGame) {
      // Host picks a game and sends control message
      const availableGameNames = Object.keys(games);
      if (availableGameNames.length === 0) {
        console.error("No games available");
        return;
      }

      const selectedGame = pickRandomGame(availableGameNames);
      const newGameId = crypto.randomUUID();

      const controlMessage: ControlMessage = {
        type: "control",
        controlType: "start-game",
        gameType: selectedGame,
        gameId: newGameId,
      };

      // Set local state
      setCurrentGame(selectedGame);
      setGameId(newGameId);

      // Send to guest
      sendEvent(controlMessage);
    } else if (disabled) {
      // Reset game state when disabled becomes false
      setCurrentGame(null);
      setGameId(null);
    }
  }, [disabled]);

  // Filter game events from incoming events
  const gameEvent = isGameMessage(event) ? event : undefined;

  // Render the appropriate game component
  const GameComponent = useMemo((): JSX.Element | undefined => {
    if (disabled || !currentGame || !gameId) {
      return undefined;
    }

    const GameComponent = games[currentGame];

    if (!GameComponent) {
      console.error(`Game component not found: ${currentGame}`);
      return undefined;
    }

    return (
      <GameComponent
        event={gameEvent}
        sendEvent={sendEvent}
        disabled={disabled}
        setPaneSize={setPaneSize}
        session={session}
      />
    );
  }, [
    session,
    disabled,
    currentGame,
    gameId,
    sendEvent,
    gameEvent,
    setPaneSize,
  ]);
  return GameComponent ?? <div className="w-full h-full bg-gray-200" />;
};

export default GamePlay;
