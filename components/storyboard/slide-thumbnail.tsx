import type { StoryboardSlide } from "@/domain/storyboard";

export function SlideThumbnail({ slide }: { slide: StoryboardSlide }) {
  return <div className={`slide-thumb role-${slide.role.toLowerCase()}`}><span>{slide.narrativeBeat}</span><b>{slide.headline}</b><div className="thumb-visual"><i></i><i></i><i></i></div></div>;
}
