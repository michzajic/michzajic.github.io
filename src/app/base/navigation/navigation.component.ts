import { Component, HostListener, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { CookieService } from '../../cookie.service';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  @Input() public currentLang = '';

  public href: string = "";
  public color: string = "";
  public textColor: string = "";

  constructor(private translate: TranslateService, private cookie: CookieService, private ccService: NgcCookieConsentService, private router: Router,
    public navigationService: NavigationService) {
    this.navigationService.isMobile = window.innerWidth < 770;

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && this.navigationService.isMobile) {
        this.href = val.url;
        switch (this.href) {
          case '/':
          case '/kontakt':
          case '/brunch':
            this.textColor = "#ffffff";
            this.color = "#000000";
            break;
          case '/obed':
          // case '/vecera':
          //   this.textColor = "#000000";
          //   this.color = "#ffffff"; break;
          case '/drinky':
            this.textColor = "#ffffff";
            this.color = "#e12d59";
            break;
        }

        document.documentElement.style.setProperty('--hamburger', this.color);
      }
    })
  }

  changeUsedLang(lang: string) {
    this.translate.use(lang);
    this.translate.currentLang = lang;
    this.currentLang = lang;

    if (this.cookie.getCookie('cookieconsent_status') === 'allow') {
      this.cookie.setCookie({
        name: 'language',
        value: lang,
        session: true
      })
    }

    this.translate
      .get(['cookieMessage', 'cookieAllow', 'cookieDeny', 'cookiePolicy'])
      .subscribe(data => {
        this.ccService.getConfig().content = this.ccService.getConfig().content || {};
        let content = this.ccService.getConfig().content
        if (content) {
          content.message = data['cookieMessage'];
          content.allow = data['cookieAllow'];
          content.deny = data['cookieDeny'];
          content.policy = data['cookiePolicy'];
        }

        this.ccService.destroy();
        this.ccService.init(this.ccService.getConfig());
      });
  }

  openFacebook() {
    window.open("https://www.facebook.com/profile.php?id=100090247062700", "_blank");
  }

  hamburgerClick() {
    this.navigationService.toggleNav();
    document.documentElement.style.setProperty('--hamburger', this.navigationService.toClose ? this.textColor : this.color);
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize() {
    this.navigationService.isMobile = window.innerWidth < 770;
  }
}
