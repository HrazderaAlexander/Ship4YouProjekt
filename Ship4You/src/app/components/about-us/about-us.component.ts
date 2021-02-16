import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
    $(document).ready(function(){
      var scroll_start = 0;
      var startchange = $('#startchange');
      var offset = startchange.offset();
       if (startchange.length){
      $(document).scroll(function() { 
         scroll_start = $(this).scrollTop();
         if(scroll_start > offset.top) {
             $("path").css('background-color', '#f0f0f0');
          } else {
             $('path').css('background-color', 'transparent');
          }
      });
       }
   });
  }

}