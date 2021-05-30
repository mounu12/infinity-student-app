import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField,CountryISO, PhoneNumberFormat, NgxIntlTelInputComponent } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-common-mobile-number',
  templateUrl: './common-mobile-number.component.html',
  styleUrls: ['./common-mobile-number.component.css']
})
export class CommonMobileNumberComponent implements OnInit,AfterViewInit  {
  @ViewChild(NgxIntlTelInputComponent) telInput: any;
  @Output() mobileNumberChange = new EventEmitter();
  @Output() callSignUp = new EventEmitter();
  @Output() isError = new EventEmitter();
  // mobile: string = '';
  // data ={
  //   // mobile : null,
  //   countryCode: '+91'
  // }
  mobileForm!: FormGroup;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  formatPhoneObject: any;
  constructor(private fb:FormBuilder) { }
  mobileNumberValid: boolean = false;
  
  
  ngOnInit(): void {
    this.createMobileForm();
  }
  ngAfterViewInit() {
    
  }

  createMobileForm(): void {
    this.mobileForm=this.fb.group({
      phone:[null, [Validators.required]]
    })
  }

  get m() { return this.mobileForm.controls; }

  public doSearch(value: any): void {
    this.mobileNumberValid = false;
    const phone = this.mobileForm.value.phone
    
    if (phone) {
      
      if ( phone.number.includes('-') || phone.number.includes('+') || phone.number.includes("(") || phone.number.includes(")") ) {
        
        let replaced_number = phone.number.replace(/[^0-9]/g,'');
        this.mobileForm.controls['phone'].setValue({ ...phone, number: replaced_number });

      } else {
        let number = phone.number;
        let country_code = phone.countryCode;
        //for now we validating indian mobile number manually
        if (country_code=='IN') {
          if (['6','7','8','9'].includes(number.substr(0,1))) {
            this.mobileNumberValid = true;
          }
        }

        this.formatPhoneObject = {
          countryCode: phone.countryCode,
          dialCode: phone.dialCode,
          e164Number: phone.e164Number,
          internationalNumber: phone.internationalNumber,
          nationalNumber: phone.nationalNumber,
          number: Number((phone.number).replace(/\s/g, ""))
        }
        // console.log(this.formatPhoneObject)
        this.mobileNumberChange.emit(this.formatPhoneObject);
      }

    } else {
      if (value) {

        let elementValue = value.srcElement.value;
        elementValue = elementValue.replace(/[^A-Za-z0-9]/g, '');
        value.srcElement.value = elementValue;
        const countrySearchTextLower = elementValue.toLowerCase();
        const country = this.telInput.allCountries.filter((c:any) => {
          if (this.telInput.searchCountryField.indexOf(this.SearchCountryField.All) > -1) {
            // Search in all fields
            if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
              return c;
            }
            if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
              return c;
            }
            if (c.dialCode.startsWith(elementValue)) {
              return c;
            }
          } else {
            // Or search by specific SearchCountryField(s)
            if (this.telInput.searchCountryField.indexOf(this.SearchCountryField.Iso2) > -1) {
              if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
                return c;
              }
            }
            if (this.telInput.searchCountryField.indexOf(this.SearchCountryField.Name) > -1) {
              if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
                return c;
              }
            }
            if (this.telInput.searchCountryField.indexOf(this.SearchCountryField.DialCode) > -1) {
              if (c.dialCode.startsWith(elementValue)) {
                return c;
              }
            }
          }
        });

        
        const preferred_in_element = this.telInput.countryList?.nativeElement.querySelector('#iti-0__item-in-preferred');
        const preferred_us_element = this.telInput.countryList?.nativeElement.querySelector('#iti-0__item-us-preferred');
        const iti_divider=this.telInput.countryList?.nativeElement.querySelector('.iti__divider');

        if (country.length > 0) {

          if (preferred_in_element) {
            preferred_in_element.style.display = 'none';
           
          }
          if (preferred_us_element) {
             preferred_us_element.style.display = 'none';
          }
          if (iti_divider) {
            iti_divider.style.display = 'none';
          }

          let elementsToShow = country.map((c: any) => c.htmlId);
          this.telInput.allCountries.forEach((c1:any) => {
            if (!elementsToShow.includes(c1.htmlId)) {
              const elToHide = this.telInput.countryList?.nativeElement.querySelector(
              '#' + c1.htmlId
              );
              if (elToHide) {
                elToHide.style.display = 'none';
              }
              
            } else {
              const elToShow = this.telInput.countryList?.nativeElement.querySelector(
              '#' + c1.htmlId
              );
              if (elToShow) {
                elToShow.style.display = 'block';
              }
              
            }
          });


        } else {

          this.telInput.allCountries.forEach((c1:any) => {
            const elToShow = this.telInput.countryList?.nativeElement.querySelector(
            '#' + c1.htmlId
            );
            if (elToShow) {
              elToShow.style.display = 'block';
            }
            
          });
        }
       
      }
      
    }

    

  }

  public signup(): void {
    this.callSignUp.emit(this.formatPhoneObject);
  }

  public isErrorMessage(value: any): void {
    this.isError.emit(this.m);
  }

}
