import CharacterCreator from "../components/CharacterCreator";
import ChatPreview from "../components/ChatPreview";
import SelectAdd from "../components/SelectAdd";

export default function Dashboard() {
  
  return (
    <div className="flex flex-1 p-6 space-x-6 overflow-auto min-h-0">
      {/* Left - Main content */}
      <div className="flex flex-col w-2/3 space-y-4 min-h-0">
        <CharacterCreator />
      </div>

      {/* Right - Chat Preview */}
      <div className="w-1/3 min-h-0 overflow-auto">
        {/* <ChatPreview /> */}
      </div>
    </div>
  );
}
