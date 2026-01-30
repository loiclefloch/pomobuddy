import { cn } from "@/shared/lib/utils";
import { CHARACTERS, type CharacterData } from "../data/characters";
import type { CharacterType } from "../types";
import { useCharacterStore } from "../stores/characterStore";

interface CharacterSelectorProps {
  onSelect?: (characterId: CharacterType) => void;
  value?: CharacterType;
  title?: string;
  layout?: "row" | "grid";
}

interface CharacterOptionProps {
  character: CharacterData;
  isSelected: boolean;
  onSelect: () => void;
}

function CharacterOption({ character, isSelected, onSelect }: CharacterOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
        "hover:bg-cozy-surface/80 focus:outline-none focus:ring-2 focus:ring-cozy-primary/50",
        isSelected && "bg-cozy-surface ring-2",
      )}
      style={{
        ["--tw-ring-color" as string]: isSelected ? character.accentColor : undefined,
      }}
      aria-pressed={isSelected}
      aria-label={`Select ${character.name} as your companion`}
    >
      <div
        className={cn(
          "w-16 h-16 flex items-center justify-center rounded-full text-4xl",
          "transition-transform duration-200",
          isSelected && "scale-110",
        )}
        style={{
          backgroundColor: isSelected ? `${character.accentColor}30` : undefined,
        }}
      >
        {character.emoji}
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          isSelected ? "text-cozy-text" : "text-cozy-text-secondary",
        )}
      >
        {character.name}
      </span>
    </button>
  );
}

export function CharacterSelector({
  onSelect,
  value,
  title = "Choose your companion",
  layout = "row",
}: CharacterSelectorProps) {
  const { selectedCharacter, setCharacter } = useCharacterStore();

  const currentCharacter = value ?? selectedCharacter;

  const handleSelect = (characterId: CharacterType) => {
    if (onSelect) {
      onSelect(characterId);
    } else {
      setCharacter(characterId);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h3 className="text-lg font-medium text-cozy-text text-center">
          {title}
        </h3>
      )}
      <div
        className={cn(
          "flex justify-center gap-2",
          layout === "grid" && "flex-wrap",
          layout === "row" && "flex-nowrap overflow-x-auto",
        )}
        role="radiogroup"
        aria-label="Character selection"
      >
        {CHARACTERS.map((character) => (
          <CharacterOption
            key={character.id}
            character={character}
            isSelected={currentCharacter === character.id}
            onSelect={() => handleSelect(character.id)}
          />
        ))}
      </div>
    </div>
  );
}
