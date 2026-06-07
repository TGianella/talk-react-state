import { CURRENT_CHAPTER } from '../current-chapter'
import TripCardCh1a from './TripCard.ch1a'
import TripCardCh1b from './TripCard.ch1b'

export type { TripCardProps } from './TripCard.ch1a'

const TripCard = CURRENT_CHAPTER === '1b' ? TripCardCh1b : TripCardCh1a
export default TripCard
