import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app-core/components/auth-service/auth.service';
import { User } from '@app-models/user.model';
import { UserService } from '@app-services/user/user.service';
import { BoardsDialogComponent } from '@app-shared/components/boards-dialog/boards-dialog.component';
import { ChangePasswordDialogComponent } from '@app-shared/components/change-password-dialog/change-password-dialog.component';
import { ConfirmDeleteImageDialogComponent } from '@app-shared/components/confirm-delete-image-dialog/confirm-delete-image-dialog.component';
import { EditPhoneNumberDialogComponent } from '@app-shared/components/edit-phone-number-dialog/edit-phone-number-dialog.component';
import { ExamDialogComponent } from '@app-shared/components/exam-dialog/exam-dialog.component';
import { GradesdialogComponent } from '@app-shared/components/gradesdialog/gradesdialog.component';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})

export class EditProfileComponent implements OnInit {

  userForm!: FormGroup;
  user!: User;
  files: string[] = [];
  profileImageUrl = '';
  userId: any;
  profilePhoto: any;
  pass_key: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef) {
    this.userId = Number(this.activatedRoute.snapshot.params.id);
    // this.createUserForm();

    // this.pass_key = (localStorage.getItem('pass_key'))
    this.pass_key = this.authService.pass_key.subscribe(pk => this.pass_key = pk)
    console.log(localStorage.getItem('pass_key'), this.pass_key)
    this.userForm?.get('password')?.setValue(this.pass_key);
  }

  // @ViewChild('fileInput')
  // el!: ElementRef;
  // imageUrl: any = "https://i.ibb.co/fDWsn3G/buck.jpg";
  // editFile: boolean = true;
  // removeUpload: boolean = false;

  ngOnInit(): void {
    // this.createUserForm();
    if (this.userId) {
      this.createUserForm();
      this.loadUser();
    } else {
    }
  }

  createUserForm(): any {
    this.userForm = this.formBuilder.group({
      board: this.formBuilder.group({
        boardName: [''],
        boardimage: [''],
        description: [''],
        id: [''],
      }),
      email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      firstName: [''],
      grade: this.formBuilder.group({
        description: [''],
        gradeName: [''],
        id: ['']
      }),
      isdCode: [''],
      lastLoggedInTime: [''],
      lastName: [''],
      password: [''],
      phoneNumber: [null, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      profilePhoto: [''],
      profileUpdated: [false],
      targetexams: this.formBuilder.array([]),
      userCountry: [''],
      userName: [''],
      userType: this.formBuilder.group({
        id: [''],
        type: [''],
      }),
      isWhatsappConsent: [true],
      id: ['']
    });
  }

  loadUser(): void {
    this.userService.loadUserDetails(this.userId).subscribe((data) => {
      this.user = data;
      this.setUserForm();
    });
  }

  setUserForm(): void {
    this.userForm = this.formBuilder.group({
      board: this.user.board ? this.setBoard(this.user.board ? this.user.board : {}) : null,
      email: [this.user.email, [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      firstName: [this.user.firstName],
      grade: this.user.grade ? this.setGrade(this.user.grade ? this.user.grade : {}) : null,
      isdCode: [this.user.isdCode],
      lastLoggedInTime: [this.user.lastLoggedInTime],
      lastName: [this.user.lastName],
      password: [this.user.password],
      phoneNumber: [this.user.phoneNumber, [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      profilePhoto: [this.user.profilePhoto],
      profileUpdated: [this.user.profileUpdated],
      targetexams: this.setTargetExams(this.user.targetexams ? this.user.targetexams : []),
      userCountry: [this.user.userCountry],
      userName: [this.user.userName],
      userType: this.user.userType ? this.setUserType(this.user.userType ? this.user.userType : {}) : null,
      isWhatsappConsent: [this.user.isWhatsappConsent],
      id: [this.user.id]
    });
  }

  setBoard(board: any): any {
    return this.formBuilder.group({
      boardName: [board.boardName],
      boardimage: [board.boardimage],
      description: [board.description],
      id: [board.id]
    });
  }

  setGrade(grade: any): any {
    return this.formBuilder.group({
      description: [grade.description],
      gradeName: [grade.gradeName],
      id: [grade.id]
    });
  }

  createTargetExams(value: any): any {
    return this.formBuilder.group({
      description: value.description,
      examsimage: value.examsimage,
      id: value.id,
      targetExam: value.targetExam,
    });
  }

  setTargetExams(x: any): any {
    const arr = new FormArray([]);
    x.forEach((y: any) => {
      arr.push(this.formBuilder.group({
        description: y.description,
        examsimage: y.examsimage,
        id: y.id,
        targetExam: y.targetExam,
      }));
    });
    return arr;
  }

  setUserType(userType: any): any {
    return this.formBuilder.group({
      id: [userType.id],
      type: [userType.type]
    });
  }

  get u() { return this.userForm.controls; }

  getFileName(photo: any): void {
    const photoUrl = photo
    // const pathname = new URL(url).pathname;
    const index = photoUrl?.lastIndexOf('/');
    const sub = (-1 !== index) ? photoUrl.substring(index + 1) : photoUrl;
    return sub;
  }

  showMyProfile(): void {
    this.router.navigate(['myprofile']);
  }

  logout(): void {
    this.userService.emptyUser();
    localStorage.clear()
    this.router.navigate([''])
  }

  onFileChanged(event: any, imageName: string): void {
    this.files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      switch (imageName) {
        case 'profileImage': this.readerOnload(event, imageName, i); break;
        default: break;
      }
      const file = event.target.files[i];
      // this.files.push({ data: file });
      this.files.push(file);
      console.log(this.files)
    }
    event.target.value = ''
  }

  readerOnload(event: any, imageName: any, i: number): any {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      switch (imageName) {
        case 'profileImage': this.profileImageUrl = event.target.result; break;
        default: break;
      }
    };
    reader.readAsDataURL(event.target.files[i]);
    return reader;
  }

  onUpload(imageName: string): void {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const formData = new FormData();
      formData.append('file', file);
      this.checkNameAndStoreImageUrl(imageName, formData);
    }
  }

  checkNameAndStoreImageUrl(imageName: string, formData: FormData): any {
    this.userService.uploadImage(this.userId, formData).subscribe((data: any) => {
      console.log(data);
      if (data) {
        switch (imageName) {
          case 'profileImage': localStorage.setItem('profileImageUrl', data.photoUrl);
            this.authService.setPhoto(data.photoUrl)
            this.userForm.get('profilePhoto')?.setValue(data.photoUrl);
            break;
          default: break;
        }
      }
    },
      (err: any) => {                                     // on error
        console.log(err)
      });
  }

  confirmDeletePhoto(): void {
    const config: MatDialogConfig = {
      width: '487px',
      data: { message: `Delete Profile Image?`, message2: `Are you sure you want to delete your profile image` }
    };
    const dialogRef = this.dialog.open(ConfirmDeleteImageDialogComponent, config);
    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed === true) {
        this.deleteProfilePhoto();
      }
    });
  }

  deleteProfilePhoto(): void {
    const fileName = this.getFileName(this.userForm.value.profilePhoto)
    this.userService.deleteImage(fileName, this.userId).subscribe((data: any) => {
      console.log(data);
      // TO DO API
      // this.authService.setPhoto(data.photoUrl)
      // this.profileImageUrl = '../../../../assets/img/empty-profile.svg'
      // this.userForm.get('profilePhoto')?.setValue(null);
    },
      (error: any) => {                                     // on error
        console.log(error);
        this.authService.setPhoto(null)
        this.profileImageUrl = '../../../../assets/img/empty-profile.svg'
        this.userForm.get('profilePhoto')?.setValue(null);
      });
  }

  setDefaultPic() {
    this.profilePhoto = '../../../../assets/img/empty-profile.svg';
  }

  // uploadFile(event:any) {
  //   let reader = new FileReader(); // HTML5 FileReader API
  //   let file = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //     reader.readAsDataURL(file);

  //     // When file uploads set it to file formcontrol
  //     reader.onload = () => {
  //       this.imageUrl = reader.result;
  //       this.userForm.patchValue({
  //         profilePhoto: reader.result
  //       });
  //       this.editFile = false;
  //       this.removeUpload = true;
  //     }
  //     // ChangeDetectorRef since file is loading outside the zone
  //     this.cd.markForCheck();        
  //   }
  // }

  // // Function to remove uploaded file
  // removeUploadedFile() {
  //   let newFileList = Array.from(this.el.nativeElement.files);
  //   this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
  //   this.editFile = true;
  //   this.removeUpload = false;
  //   this.userForm.patchValue({
  //     profilePhoto: [null]
  //   });
  // }

  // Edit grade

  editSelectedGrade(): void {
    const config: MatDialogConfig = {
      width: '570px', height: '280px',
      data: { // message:'Great, your account is almost ready',
        // message2: 'Help us with your academic details, so we can curate content specially for you',
        // message3: 'What grade are you in',
        isGradeEdit: true,
        boardsData: this.userForm.value.grade
      }
    };
    const dialogRef = this.dialog.open(GradesdialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('edit grade value', value)
        this.updateGrade(value);
      }
    });
  }

  updateGrade(value: any): void {
    this.userForm.get('grade')?.setValue(value);
  }

  // Edit Board

  editSelectedBoard(): void {
    const config: MatDialogConfig = {
      width: '570px',
      height: '536px',
      data: {
        message: 'What board are you enrolled in?',
        message2: `If you can’t find it in the list, enter in the search box`,
        isBoardEdit: true,
        boardsData: this.userForm.value.board,
      }
    };
    const dialogRef = this.dialog.open(BoardsDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('edit board value', value)
        this.updateBoard(value);
      }
    });
  }

  updateBoard(value: any): void {
    this.userForm.get('board')?.setValue(value);
  }

  // Edit target exams

  editSelectedTargetExam(): void {
    const config: MatDialogConfig = {
      width: '570px',
      height: '626px',
      data: {
        message: 'What exams are you targetting?',
        message2: `Select as many. If you can’t find it in the list, enter in the search box`,
        isExamEdit: true,
        examsData: this.userForm.value.targetexams
      }
    };
    const dialogRef = this.dialog.open(ExamDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('edit exams value', value)
        this.updateTargetExam(value);
      }
    });
  }

  updateTargetExam(value: any): void {
    this.deleteTargetExam();
    this.addTargetExam(value);
  }

  deleteTargetExam(): void {
    const control = (this.userForm.controls['targetexams'] as FormArray)
    while (control.length !== 0) {
      control.removeAt(0)
    }
  }

  addTargetExam(value: any) {
    for (let i = 0, len = value.length; i < len; i++) {
      (this.userForm.get('targetexams') as FormArray).insert(i, this.createTargetExams(value[i]));
    }
  }

  get targetExam(): any { return this.userForm.get('targetexams') as FormArray }

  // Edit phone number

  editPhoneNumber(): void {
    const config: MatDialogConfig = {
      width: '487px',
      height: '295px',
      data: {
        message: 'Edit Phone Number',
        phone: this.userForm.value.phoneNumber,
        isdCode: this.userForm.value.isdCode,
        userObject: this.userForm.value
      }
    };
    const dialogRef = this.dialog.open(EditPhoneNumberDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('edit phn value', value)
        // this.loadUser()
        this.userForm?.get('phoneNumber')?.setValue(value);
      }
    });
  }

  // Change password

  editPassword(): void {
    const config: MatDialogConfig = {
      width: '570px',
      // height: '550px',
      data: {
        message: 'Change password',
        password: this.userForm.value.password,
        userObject: this.userForm.value
      }
    };
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, config);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        console.log('edit pwd value', value)
        this.userForm?.get('password')?.setValue(value);
        // this.loadUser()
      }
    });
  }

  updateUser(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      const obj = this.userForm.value
      console.log('updated user data', JSON.stringify(obj))
      this.userService.updateUserDetails(obj).subscribe((data: any) => {
        alert('User details updated successfully');
        this.router.navigate(['myprofile']);
        localStorage.setItem('token', data.accessToken)
      },
        (error: any) => {                                     // on error
          alert(error.error.message);
        });
    }
  }

}
