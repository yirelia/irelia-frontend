export const masks = [
  `<mask id="FillPattern.Horizontal.mask" x="0" y="0" width="8" height="8" stroke="none" fill="#ffffff" patternUnits="userSpaceOnUse" >
  <rect x="0" y="3" width="8" height="1" />
  </mask>`,
  `<mask id="FillPattern.Vertical.mask" x="0" y="0" width="8" height="8" stroke="none" fill="#ffffff" patternUnits="userSpaceOnUse" >
  <rect x="4" y="0" width="1" height="8" />
  </mask>`,
  `<mask id="FillPattern.Cross.mask" x="0" y="0" width="8" height="8" stroke="none" fill="#ffffff" patternUnits="userSpaceOnUse" >
  <rect x="4" y="0" width="1" height="3" />
  <rect x="0" y="3" width="8" height="1" />
  <rect x="4" y="4" width="1" height="4" />
  </mask>`,
  `<mask id="FillPattern.Forward.mask" x="0" y="0" width="8" height="8" stroke="none" fill="#ffffff" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="1" height="1" />
  <rect x="1" y="1" width="1" height="1" />
  <rect x="2" y="2" width="1" height="1" />
  <rect x="3" y="3" width="1" height="1" />
  <rect x="4" y="4" width="1" height="1" />
  <rect x="5" y="5" width="1" height="1" />
  <rect x="6" y="6" width="1" height="1" />
  <rect x="7" y="7" width="1" height="1" />
  </mask>`,
  `<mask id="FillPattern.Backward.mask" x="0" y="0" width="8" height="8" stroke="none" fill="#ffffff" patternUnits="userSpaceOnUse" >
  <rect x="7" y="0" width="1" height="1" />
  <rect x="6" y="1" width="1" height="1" />
  <rect x="5" y="2" width="1" height="1" />
  <rect x="4" y="3" width="1" height="1" />
  <rect x="3" y="4" width="1" height="1" />
  <rect x="2" y="5" width="1" height="1" />
  <rect x="1" y="6" width="1" height="1" />
  <rect x="0" y="7" width="1" height="1" />
  </mask>`,
  `<mask id="FillPattern.CrossDiag.mask" x="0" y="0" width="8" height="8" stroke="none" fill="#ffffff" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="1" height="1" />
  <rect x="7" y="0" width="1" height="1" />
  <rect x="1" y="1" width="1" height="1" />
  <rect x="6" y="1" width="1" height="1" />
  <rect x="2" y="2" width="1" height="1" />
  <rect x="5" y="2" width="1" height="1" />
  <rect x="3" y="3" width="2" height="2" />
  <rect x="2" y="5" width="1" height="1" />
  <rect x="5" y="5" width="1" height="1" />
  <rect x="1" y="6" width="1" height="1" />
  <rect x="6" y="6" width="1" height="1" />
  <rect x="0" y="7" width="1" height="1" />
  <rect x="7" y="7" width="1" height="1" />
  </mask>`
];

export const parttens = [
  `<pattern id="FillPattern.Horizontal.pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="#a0a0a4" mask="url(#FillPattern.Horizontal.mask)" />
  </pattern>`,
  `<pattern id="FillPattern.Vertical.pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="#a0a0a4" mask="url(#FillPattern.Vertical.mask)" />
  </pattern>`,
  `<pattern id="FillPattern.Cross.pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="#a0a0a4" mask="url(#FillPattern.Cross.mask)" />
  </pattern>`,
  `<pattern id="FillPattern.Forward.pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="#a0a0a4" mask="url(#FillPattern.Forward.mask)" />
  </pattern>`,
  `<pattern id="FillPattern.Backward.pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="#a0a0a4" mask="url(#FillPattern.Backward.mask)" />
  </pattern>`,
  `<pattern id="FillPattern.CrossDiag.pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="#a0a0a4" mask="url(#FillPattern.CrossDiag.mask)" />
  </pattern>`
];

export const PatterMap = {
  'FillPattern.Horizontal': (
    id: string,
    fill: string
  ) => `<pattern id="${id}" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="${fill}" mask="url(#FillPattern.Horizontal.mask)" />
  </pattern>`,
  'FillPattern.Vertical': (
    id: string,
    fill: string
  ) => `<pattern id="${id}" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="${fill}" mask="url(#FillPattern.Vertical.mask)" />
  </pattern>`,
  'FillPattern.Cross': (
    id: string,
    fill: string
  ) => `<pattern id="${id}" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" ><rect x="0" y="0" width="8" height="8" stroke="none" fill="${fill}" mask="url(#FillPattern.Cross.mask)" />
  </pattern>`,
  'FillPattern.Forward': (id: string, fill: string) =>
    `<pattern id="${id}" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" ><rect x="0" y="0" width="8" height="8" stroke="none" fill="${fill}" mask="url(#FillPattern.Forward.mask)" /></pattern>`,
  'FillPattern.Backward': (
    id: string,
    fill: string
  ) => `<pattern id="${id}" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="${fill}" mask="url(#FillPattern.Backward.mask)" />
  </pattern>`,
  'FillPattern.CrossDiag': (
    id: string,
    fill: string
  ) => `<pattern id="${id}" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" >
  <rect x="0" y="0" width="8" height="8" stroke="none" fill="${fill}" mask="url(#FillPattern.CrossDiag.mask)" />
  </pattern>`
};
