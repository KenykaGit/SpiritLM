import Image from "next/image";
import { IMAGES } from "../../../configs/paths/images.paths";

export function Footer() {
  return (
    <footer className="mx-5 flex items-center justify-between gap-2 border-t border-spirit-border-subtle px-0 py-8 text-xs sm:mx-7 lg:mx-10">
      <Image
        src={IMAGES.LOGO}
        alt="SpiritLM"
        width={100}
        height={40}
      />
      <small className="whitespace-nowrap text-xs text-spirit-quiet">© SpiritLM 2026</small>
    </footer>
  );
}
