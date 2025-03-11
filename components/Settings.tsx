import SettingsHeader from "./SettingsHeader";
import SettingsTab from "./SettingsTab";

export default function Settings() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <SettingsHeader />
        <SettingsTab />
      </div>
    </div>
  );
}
