/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { i18nExtractor as _ } from '@playitforward/ngx-i18n';

import { FooterItem } from './footer.model';

@Component({
  selector: 'playitforward-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() appName = 'playitforward';

  today = new Date();
  footers: FooterItem[] = [
    {
      type: _('COMMON.RESOURCES'),
      links: [
        {
          name: _('COMMON.GITHUB'),
          link: 'https://github.com/PlayItForward-IO',
          icon: 'github',
          external: true,
        },
        {
          name: _('COMMON.WHITEPAPER'),
          link: '/assets/docs/PlayItForward.pdf',
          icon: 'clipboard-text-outline',
          target: '_blank',
          external: true,
        },
      ],
    },
    {
      type: _('COMMON.SOCIAL'),
      links: [
        {
          name: _('SOCIAL.TWITTER'),
          link: 'https://twitter.com/PlayItFWD_Token',
          external: true,
          icon: 'twitter',
        },
        {
          name: _('SOCIAL.INSTAGRAM'),
          link: 'https://www.instagram.com/playitforwardtoken/',
          external: true,
          icon: 'instagram',
        },
        // {
        //   name: _('SOCIAL.LINKEDIN'),
        //   link: 'https://www.linkedin.com/groups/13989324/',
        //   external: true,
        //   icon: 'linkedin',
        // },
      ],
    },
    {
      type: _('COMMON.ORGANIZATION'),
      links: [
        {
          name: _('COMMON.TERMS_CONDITIONS'),
          link: '/terms',
          icon: 'script-text-outline',
        },
        {
          name: _('COMMON.TERMS_CONDITIONS'),
          link: 'info@playitforward.info',
          icon: 'email',
          email: true,
        },
        // {
        //   name: _('COMMON.PRIVACY'),
        //   link: '/privacy',
        //   icon: 'clipboard-text-outline',
        // },
      ],
    },
  ];
}
