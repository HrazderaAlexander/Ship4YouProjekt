import { Component, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { FileService } from './Services/file.service';
import { Picture } from '../../Picture';

@Component({
  selector: 'app-root',
  templateUrl: './showUpload.html',
  styleUrls: ['./showUpload.scss']
})

export class ShowUpload{

  boatName:string;
  boatType:string;

  selectedImage: any = null;

  url:string;
  //id:string;
  file:string;

  constructor( @Inject(AngularFireStorage) private storage: AngularFireStorage, @Inject(FileService) private fileService: FileService) { }

  ngOnInit() {
    this.fileService.getImageDetailList();
  }

  /*showPreview(event: any) {
      this.selectedImage = event.target.files[0];
  }*/

  /*save() {
      var name = this.selectedImage.name;
      const fileRef = this.storage.ref(name);
      this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.url = url;
            Picture.saveFilePath = this.boatType + this.boatName;
            //Picture.saveFilePath = ;
        
            this.fileService.insertImageDetails(Picture.saveFilePath,this.url);
            alert('Upload Successful');
          })
        })
      ).subscribe();
  }*/

  /*view()
  {
    this.fileService.getImage(this.file);
  }*/

  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      Picture.saveFilePath = this.boatType + this.boatName;
      this.files.push(files.item(i));
    }
  }

}
