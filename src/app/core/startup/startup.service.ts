import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  private viaHttp(resolve: any, reject: any) {
    zip(
      this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      this.httpClient.get('assets/tmp/app-data.json'),
    )
      .pipe(
        catchError(([langData, appData]) => {
          resolve(null);
          return [langData, appData];
        }),
      )
      .subscribe(
        ([langData, appData]) => {
          // Setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);

          // Application data
          const res: any = appData;
          // Application information: including site name, description, year
          this.settingService.setApp(res.app);
          // User information: including name, avatar, email address
          this.settingService.setUser(res.user);
          // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
          this.aclService.setFull(true);
          // Menu data, https://ng-alain.com/theme/menu
          this.menuService.add(res.menu);
          // Can be set page suffix title, https://ng-alain.com/theme/title
          this.titleService.suffix = res.app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  private viaMockI18n(resolve: any, reject: any) {
    this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`).subscribe(langData => {
      this.translate.setTranslation(this.i18n.defaultLang, langData);
      this.translate.setDefaultLang(this.i18n.defaultLang);

      this.viaMock(resolve, reject);
    });
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `Jupiter Quant`,
      description: `Quantitive trading platform of JupiterFund`,
    };
    const user: any = {
      name: 'JupiterFund',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'jwei@gmail.com',
      token: '123456789',
    };
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // User information: including name, avatar, email address
    this.settingService.setUser(user);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add([
      {
        text: '系统管理',
        i18n: 'menu.system',
        group: true,
        hideInBreadcrumb: true,
        children: [
          {
            text: '仪表盘',
            link: '/dashboard',
            i18n: 'menu.system.dashboard',
            icon: 'anticon-dashboard',
          },
          {
            text: '实时监控',
            i18n: 'menu.system.monitor',
            icon: 'anticon-area-chart',
            children: [
              {
                text: '数据接收',
                link: '/monitor',
                i18n: 'menu.system.monitor.data-input',
              },
              {
                text: '策略报表',
                i18n: 'menu.system.monitor.report',
                link: '/realtime',
              },
            ],
          },
          {
            text: '控制中心',
            i18n: 'menu.system.management',
            icon: 'anticon-deployment-unit',
            children: [
              {
                text: '配置及部署',
                link: '/monitor',
                i18n: 'menu.system.management.service',
              },
              {
                text: '策略运行',
                i18n: 'menu.system.management.strategy',
                link: '/realtime',
              },
            ],
          },
        ],
      },
      {
        text: '研究中心',
        i18n: 'menu.research',
        group: true,
        hideInBreadcrumb: true,
        children: [
          {
            text: '因子',
            i18n: 'menu.research.factor',
            icon: 'anticon-appstore',
            children: [
              {
                text: '因子库',
                i18n: 'menu.research.factor.lib',
                link: '/dashboard',
              },
              {
                text: '数据挖掘',
                i18n: 'menu.research.factor.data-mining',
                link: '/dashboard',
              },
            ],
          },
          {
            text: '策略',
            i18n: 'menu.research.strategy',
            icon: 'anticon-code',
            children: [
              {
                text: '策略集合',
                i18n: 'menu.research.strategy.lib',
                link: '/dashboard',
              },
              {
                text: '历史研究',
                i18n: 'menu.research.strategy.analysis',
                link: '/analysis',
              },
              {
                text: '测试回测',
                i18n: 'menu.research.strategy.retro',
                link: '/retro',
              },
              {
                text: '综合表现',
                i18n: 'menu.research.strategy.history',
                link: '/history',
              },
            ],
          },
        ],
      },
      {
        text: '更多',
        i18n: 'menu.more',
        group: true,
        hideInBreadcrumb: true,
        children: [
          {
            text: '账户管理',
            i18n: 'menu.account.center',
            icon: 'anticon-team',
            children: [
              {
                text: '用户列表',
                link: '/account/center/user-list',
                i18n: 'menu.account.center.userlist',
              },
              {
                text: '权限控制',
                link: '/account/center/acess-control',
                i18n: 'menu.account.center.accesscontrol',
              },
            ],
          },
        ],
      },
    ]);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.viaMockI18n(resolve, reject);
    });
  }
}
