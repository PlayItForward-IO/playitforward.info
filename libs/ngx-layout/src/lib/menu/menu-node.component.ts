/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuNode } from '@playitfoward/ngx-menu';

@Component({
  selector: 'playitfoward-menu-node',
  templateUrl: './menu-node.component.html',
  styleUrls: ['./menu-node.component.scss'],
})
export class MenuNodeComponent {
  @Input() node: MenuNode;
  constructor(public router: Router) {}
}
