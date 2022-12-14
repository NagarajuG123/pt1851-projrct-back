import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/_core/services/api.service';
import { MetaService } from 'src/app/_core/services/meta.service';
import { ValidationService } from 'src/app/_core/services/validation.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/_core/services/common.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  siteKey: string = environment.reCaptchaKey;

  publicationContents: any = [];
  contactForm: FormGroup;
  isSubmitted: boolean = false;
  submitErrMsg: string = '';
  submitSuccessMsg: string = '';
  isBrowser: boolean;
  data: any = [];

  constructor(
    private apiService: ApiService,
    private metaService: MetaService,
    private recaptchaV3Service: ReCaptchaV3Service,
    @Inject(PLATFORM_ID) platformId: Object,
    fb: FormBuilder,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer,
    public commonService: CommonService,
    @Inject(DOCUMENT) private dom,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.contactForm = fb.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      email: [
        '',
        Validators.compose([
          Validators.required,
          ValidationService.emailValidator,
        ]),
      ],
      message: ['', Validators.compose([Validators.required])],
      reCaptchaCode: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    const aboutus = this.apiService.getAPI2(`about`);
    const meta = this.apiService.getAPI2(`meta?page=about`);
    forkJoin([ aboutus, meta]).subscribe((results) => {
      this.data = results[0];
      if (this.data?.contents?.length > 1) {
        for (let i = 1; i < this.data?.contents.length; i++) {
          this.publicationContents.push(this.data.contents[i]);
        }
      }
      this.metaService.setSeo(results[1].data);
    });
    this.recaptchaV3Service.execute('recaptcha')
    .subscribe((token: string) => {
      this.contactForm.controls.reCaptchaCode.setValue(token);
    });
  }

  isShow() {
    return this.commonService?.publication?.id == '1851';
  }

  onContactSubmit(contactForm: FormGroup) {
    this.isSubmitted = true;
    if (!contactForm.valid) {
      return;
    }
    this.apiService
      .postAPI('1851/about-us', contactForm.value)
      .subscribe((result) => {
        if (typeof result.data !== 'undefined') {
          this.isSubmitted = false;
          this.submitSuccessMsg = result.data.message;
          this.resetForm();
        } else {
          this.submitErrMsg = result.error.message;
        }
      });
   }
  resetForm() {
    this.contactForm.patchValue({
      first_name: '',
      last_name: '',
      email: '',
      message: '',
      reCaptchaCode: '',
    });
  }
  ngAfterViewInit(){
    if(this.isBrowser){
      $('.modal').on('hidden.bs.modal', function(){
        $('.modal').hide();
        const modalVideo = $(this).html();
        $(this).html(modalVideo);
      });
    }
    const recaptchaElement =this.dom.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
    if (recaptchaElement) 
    {
      recaptchaElement.style.visibility = 'visible';
    }
  }
  ngOnDestroy() {
    const recaptchaElement = this.dom.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
    if (recaptchaElement) {
      recaptchaElement.style.visibility = 'hidden';
    }
  }
}
