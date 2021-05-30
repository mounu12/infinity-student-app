import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamService } from '@app-services/test/exam.service';
import { TestlistService } from '@app-services/test/testlist.service';
import { UserService } from '@app-services/user/user.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit {
  token: any;
  @Input() infobox: any;
  constructor(private examservice: ExamService, private testListService: TestlistService, private router: Router, private route: ActivatedRoute, private userService: UserService,
    private store: LocalStorageService) {
    this.token = localStorage.getItem('token')
    }

  ngOnInit(): void {
    
  }
  getParameterByName(name:any, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  attemptFirstPaper(infobox: any) {
    var examtype: any;
    let url = window.location.origin+'/'+infobox.link.route;
    if (this.getParameterByName('examtype',url)) {
       examtype = this.getParameterByName('examtype', url);
    } else {
       examtype = '';
    }
    

    let _headers = {
      'accesstoken': this.token,
      'studentid': localStorage.getItem('studentid'),
      'methodtype': 'RULES'
    };

    this.testListService.getPreviousAndPresentMockTests(_headers).subscribe((overallTests: any) => {
      let test_list;
      if (examtype === 'MOCKTEST') {
        test_list = overallTests.filter((dr: any) => dr.examtype === 'MOCKTEST' || dr.examtype === 'JEEMAIN');
      } else {
        test_list = overallTests.filter((dr: any) => dr.examtype !== 'MOCKTEST' && dr.examtype !== 'JEEMAIN');
      }

      if (test_list.length>0) {
        this.examservice.setPresentExamInfo(test_list[0]);
        this.router.navigateByUrl('/dashboard/testinstructions');
      }



    })



    //window.location.href = infobox.link.route+'&attemptFirst=yes';
  }

}
