import Image from "next/image";
import { ASSET_PATHS } from "../../../../configs/paths";

export function Footer() {
  return (
    <footer className="mx-10 flex items-center justify-between gap-2 border-t border-[#292925] text-xs p-8">
      <Image
        className="block size-6 object-contain"
        src={ASSET_PATHS.icon}
        alt="SpiritLM"
        width={24}
        height={24}
      />
      <small className="whitespace-nowrap text-xs opacity-50">© SpiritLM 2026</small>
    </footer>
  );
}
