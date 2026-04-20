import {
  animate,
  AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

const DURATION = '320ms';
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DISTANCE = 28;

const overlapStyles = query(
  ':enter, :leave',
  [
    style({
      position: 'absolute',
      inset: 0,
      width: '100%',
    }),
  ],
  { optional: true },
);

/**
 * Global route-level transition. Entering page fades + slides from the
 * direction of travel; leaving page exits in the opposite direction.
 *
 * - Initial render (`void => *`) is a no-op to avoid hydration flicker.
 * - `* => forward` slides incoming from right, outgoing to left.
 * - `* => back` mirrors the forward animation.
 */
export const routeAnimations: AnimationTriggerMetadata = trigger('routeAnimations', [
  transition('void => *', []),

  transition('* => forward', [
    overlapStyles,
    query(':enter', [style({ opacity: 0, transform: `translateX(${DISTANCE}px)` })], {
      optional: true,
    }),
    group([
      query(
        ':leave',
        [animate(`${DURATION} ${EASING}`, style({ opacity: 0, transform: `translateX(-${DISTANCE}px)` }))],
        { optional: true },
      ),
      query(
        ':enter',
        [animate(`${DURATION} ${EASING}`, style({ opacity: 1, transform: 'translateX(0)' }))],
        { optional: true },
      ),
    ]),
  ]),

  transition('* => back', [
    overlapStyles,
    query(':enter', [style({ opacity: 0, transform: `translateX(-${DISTANCE}px)` })], {
      optional: true,
    }),
    group([
      query(
        ':leave',
        [animate(`${DURATION} ${EASING}`, style({ opacity: 0, transform: `translateX(${DISTANCE}px)` }))],
        { optional: true },
      ),
      query(
        ':enter',
        [animate(`${DURATION} ${EASING}`, style({ opacity: 1, transform: 'translateX(0)' }))],
        { optional: true },
      ),
    ]),
  ]),
]);
