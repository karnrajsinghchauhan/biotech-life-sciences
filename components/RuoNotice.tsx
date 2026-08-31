import { site } from "@/lib/config"

/** The RUO disclaimer, always rendered with the highlighted `.notice` treatment —
 *  never demoted to a muted caption. Used on every page that sells a compound. */
export default function RuoNotice() {
  return <p className="notice">{site.disclaimer}</p>
}
