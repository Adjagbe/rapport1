import { Component } from '@angular/core';

@Component({
  selector: '.unlock-icon',
  standalone: true,
  template: `<svg
                width="45"
                height="27"
                viewBox="0 0 45 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="45" height="27" rx="13.5" fill="#CDCDCD" />
                <g filter="url(#filter0_d_6_3388)">
                  <rect
                    x="4"
                    y="4"
                    width="19"
                    height="19"
                    rx="9.5"
                    fill="#FDFDFD"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_6_3388"
                    x="3"
                    y="3"
                    width="21"
                    height="21"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_6_3388"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_6_3388"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>`,
  styles: [``],
})
export class UnlockIconComponent { }
