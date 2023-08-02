           //flush_data();
           let isplaying=false;
           let audio;
           let html='';
           const data_obj= retrieve_data();
           let categories=data_obj.categories;
           let todolist=data_obj.todolist;
           console.log(categories);
           console.log(todolist);

           let dropdown= document.querySelector('.sort-by');
           updateFilter();
           let displayed_list=todolist;
           updateList(); // so we first update the relative times and then we display it 
           

           //play_audio();
           function play_audio(){

               let choice = document.querySelector('.audio-selection').value;
               console.log(choice);
               if(choice==='rickroll'){
                   audio = new Audio('audios/rickroll.mp3');
                   
               }
               else if(choice==='edm'){
                   audio = new Audio('audios/Illenium-Starfall.mp3');
                   
                   
               }
               else if(choice ==='relax'){
                   audio = new Audio('audios/Cornfield_Chase.mp3');
               }
               else {
                   isplaying=false;
                   return;
               }
               audio.play();

           }
           function stop_audio(){
               if(isplaying){
               audio.pause();
               audio.currentTime=0;
               }
               document.querySelector('.message').innerHTML="";
               document.querySelector('.alert').style.opacity =0;
               document.querySelector('.alert').style.zIndex='-3';
 
              
               isplaying=false;
           }
           function update_categories(){
               
               for( let i =0; i<categories.length; i++){
                   let category=categories[i];
                   let delete_flag=true;
                   for(let j =0; j<todolist.length; j++){
                       if(todolist[j].category=== category){
                          delete_flag=false; 
                          break;
                       }
                       
                   }
                   if(delete_flag){
                       categories.splice(i,1);
                       save_data();
                       document.querySelector('.sort-by').innerHTML=`            <option value="default" selected="selected">Default</option>
           <option value="recent" >Most Recent</option>
           <option value="priority high">Priority: High</option>
           <option value="priority medium">Priority: Medium</option>
           <option value="priority low">Priority: Low</option>
           <option value = "oldest">Oldest</option>
           <option value = "time most">Most time</option>
           <option value="time least">Least time</option>`;
           updateFilter();
                       return;

                   }
               }
               

           }




           function updateFilter(){
           for(let i =0; i<categories.length; i++){
               dropdown.innerHTML+=`<option value="${categories[i]}" >Category: ${categories[i]}</option>`;

           }
       }
          setInterval(refreshList, 1000);
           async function refreshList(){
               
               minimal_update();
           }

           function addElement(){
               obj={};
               if(error())
               return;
               obj.name= document.querySelector('.name-input').value;
               obj.date = document.querySelector('.date-input').value;
               obj.dateCreatedMilliseconds= (new Date()).getMilliseconds();
               obj.time= document.querySelector('.time-input').value;
               obj.priority= document.querySelector('.priority-input').value;
               obj.category= document.querySelector('.category-input').value;
               const [time_string, time_left] = 
               get_time_left(obj.date, obj.time);
               obj.time_string=time_string;
               obj.time_left=time_left;
               obj.max_time= obj.time_left;
               let percent= get_percent(obj.time_left, obj.max_time);
               obj.percent=percent;
               todolist.push(obj);
               addCategories(obj.category);
               save_data();
               obj.alert=false;
               sort();


           }
           function get_time_left(date, time){
               const currentDate= new Date();
               const due_date= new Date(date+' ' + time);
               let time_string='';
               let time_left= (due_date.getTime()- currentDate.getTime())/1000;// converting to seconds
              
               if(time_left<=0){
                   return ['Due', time_left];
               }
               let years = due_date.getFullYear() - currentDate.getFullYear();
               currentDate.setFullYear(currentDate.getFullYear() + years);
               if(isFuture(currentDate, due_date)){
                   currentDate.setFullYear(currentDate.getFullYear() -1); 
                   years--;
               }
               
               else if(isEqual(currentDate, due_date))
               {
                   time_string=time_string+years+ " yr ";
                  
                   return [time_string, time_left];
               }
           
               if(years!=0){
               time_string=time_string+years+ " yr ";
               return [time_string, time_left];
               }

               let months =0;
               while(true){
                   currentDate.setMonth(currentDate.getMonth() + 1);// leveraging the fact that in js if the days exceed a months given days
                   // it moves to the next month
                   if(isFuture(currentDate, due_date)){
                       currentDate.setMonth(currentDate.getMonth() - 1);
                       if(months>0){
                       time_string=time_string+months+ " m ";
                       return [time_string, time_left];
                       }
                       break;

                   }
                   else{
                       months++;
                   }
               }
               if(months>0){
                       time_string=time_string+months+ " m ";
                       return [time_string, time_left];
                       }

               let days =0;
               while(true){
                   currentDate.setDate(currentDate.getDate() + 1);// leveraging the fact that in js if the days exceed a months given days
                   // it moves to the next month
                   if(isFuture(currentDate, due_date)){
                       currentDate.setDate(currentDate.getDate() - 1);
                       if(days>0){
                       time_string=time_string+days+ " d ";
                       return [time_string, time_left];
                       }
                       break;

                   }
                   else{
                       days++;
                   }
               }
               if(days>0){
                       time_string=time_string+days+ " d ";
                       return [time_string, time_left];
                       }

               let hours = 0;
               while(true){
                   currentDate.setHours(currentDate.getHours() + 1);// leveraging the fact that in js if the days exceed a months given days
                   // it moves to the next month
                   if(isFuture(currentDate, due_date)){
                       currentDate.setHours(currentDate.getHours() - 1);
                       if(hours>0){
                       time_string=time_string+hours+ " hr ";
                       return [time_string, time_left];
                       }
                       break;

                   }
                   else{
                       hours++;
                   }
               }
             
               if(hours>0){
                       time_string=time_string+hours+ " hr ";
                       return [time_string, time_left];
                       }

               let mins = 0;
               while(true){
                   currentDate.setMinutes(currentDate.getMinutes() + 1);// leveraging the fact that in js if the days exceed a months given days
                   // it moves to the next month
                   if(isFuture(currentDate, due_date)){
                       currentDate.setMinutes(currentDate.getMinutes() - 1);
                       
                       time_string=time_string+mins+ " mins ";
                       return [time_string, time_left];
                       
                       

                   }
                   else{
                       mins++;
                   }
               }
             
                       time_string=time_string+mins+ " mins ";
                       return [time_string, time_left];
                       
 
           }

           function isFuture( date1, date2)// is date1 after date2
           {
               return date1.getTime()>date2.getTime();

           }
           function isEqual(date1 , date2){
               return date1.getTime() === date2.getTime();
           }
           function isLastDay(day, month, year){
               var d= new Date(year, month, 0);
               return day> d.getDate();
           }
           function getLastDay(day, month, year){
               var d= new Date(year, month, 0);
               return d.getDate();
           }
           function get_percent(time, max_time){
               if(time<=0)
               return 0.0;
               return ((time /max_time)* 100.0);
           }
           function addCategories(category){
               for(let i =0; i<categories.length; i++){
                   if(categories[i]===category.toLowerCase()){
                       return;
                   }
                   
               }
               categories.push(category.toLowerCase());
               save_data();
               dropdown.innerHTML+=`<option value="${category.toLowerCase()}" >Category: ${category.toLowerCase()}</option>`;

           }

           function save_data()
           {
               const data_obj={};
               data_obj.todolist= todolist;
               data_obj.categories=categories;
               localStorage.setItem('all_data', JSON.stringify(data_obj));
           }

           function retrieve_data(){
               const obj = JSON.parse(localStorage.getItem('all_data'));
               if(obj!== null && obj!== undefined)
               return obj;
               return {todolist:[],categories:[]};
           }
           function flush_data(){
               localStorage.removeItem('all_data');
           }
           function displaylist(list= todolist){
               let listHtml=''; // accumulator for html
               for(let i = 0; i< list.length; i++){
               const todo= list[i];
               const html= `<div class='list-item'><div class='element'>${todo.name}</div> 
               <div class='element'>  ${todo.date}</div> 
               <div class='element'>  ${todo.time}</div> 
               <div class='element time${i} '> ${todo.time_string}</div>
               <div class='progress-bar-container'><div class="progress-bar js-progress${i}" id="progress-bar " style="width:${todo.percent}%; 
               " ></div></div>
               <div class="element ${todo.priority}">${todo.priority}</div>
               <div class="element">${todo.category}</div>
               <div class="element"><button class= "delete" onclick="
               console.log('delete button');
               delete_item(displayed_list[${i}]);
               update_categories();
               sort();
               ">Delete</button></div></div>
               `;
               listHtml+=html;
               
       

               }
               document.querySelector('.todolist').innerHTML=listHtml;
           }

           function updateList(){
               for(let i = 0; i< todolist.length; i++){
               const todo= todolist[i];
               const [time_string, time_left] = 
               get_time_left(todo.date, todo.time);
               todo.time_string=time_string;
               todo.time_left=time_left;
               let percent= get_percent(todo.time_left, todo.max_time);
              
               todo.percent=percent;
               if(todo.time_string==='Due' && !todo.alert){
                   if(!isplaying && document.querySelector('.audio-selection').value!=='silent'){
                   play_audio();
                   isplaying=true;
                   }
                   document.querySelector('.message').innerHTML+=`<div>${todo.name}'s due date has passed</div>`;
                   document.querySelector('.alert').style.opacity=1;
                   document.querySelector('.alert').style.zIndex='3';


                   todo.alert=true;

               }
               

           }
           save_data();
           sort();
       }
       function error(){
           let error_line= document.querySelector('.error-line');
           let obj ={};
           let test_value = document.querySelector('.name-input').value;
           obj.name=test_value;
           if(test_value=== null || test_value=== undefined || test_value.length===0)
           {
               error_line.innerHTML= "Missing Attribute: Name";
               return true;
           }
           test_value = document.querySelector('.date-input').value;
           obj.date=test_value;
           if(test_value=== null || test_value=== undefined || test_value.length===0)
           {
               error_line.innerHTML= "Missing Attribute: Date";
               return true;
           }
           let date = test_value;
           test_value = document.querySelector('.time-input').value;
           obj.time= test_value;
           if(test_value=== null || test_value=== undefined || test_value.length===0)
           {
               error_line.innerHTML= "Missing Attribute: Time";
               return true;
           }
           let time = test_value;
           let currentDate= new Date();
           let due_date = new Date( date + ' ' + time);
           if(isFuture(currentDate, due_date))
           {
               error_line.innerHTML= "Due Date has already passed";
               return true;
           }

           test_value= document.querySelector('.category-input').value;
           obj.category=test_value;
           if(test_value=== null || test_value=== undefined || test_value.length===0)
           {
               error_line.innerHTML= "Missing Attribute: Category";
               return true;
           }

           for(let i =0 ; i<todolist.length; i++){
               if(isEqualItem(obj, todolist[i]))
               {
                   error_line.innerHTML= "Duplicate To do item";
                   return true;
               }
           }

           error_line.innerHTML= "";
           return false;
       }

       function sort(){
           templist=[];
           let sorter= document.querySelector('.sort-by');
           if(sorter.value==='default' || sorter.value==='oldest')
           {
               displayed_list=todolist;
               displaylist();
               return;
           }
           if(sorter.value==='recent'){
               for(let j=0, i = todolist.length-1; i>=0; i--, j++){
                   templist[j]= todolist[i];
                   
               }
               displayed_list=templist;
               displaylist(templist);
               return;
           }
           if(sorter.value ==='time least'){
               for(let j=0; j<todolist.length; j++){
                   templist[j]= todolist[j];
                   
               }
               for( let i = 0; i<templist.length; i++){
                   for(let j =0; j<templist.length-1-i; j++){
                       if(templist[j].time_left>templist[j+1].time_left){
                           let temp_var= templist[j];
                           templist[j]=templist[j+1];
                           templist[j+1]= temp_var;
                       }
                   }
               }
               displayed_list=templist;
               displaylist(templist);
               return;
           }
           if(sorter.value ==='time most'){
               for(let j=0; j<todolist.length; j++){
                   templist[j]= todolist[j];
                   
               }
               for( let i = 0; i<templist.length; i++){
                   for(let j =0; j<templist.length-1-i; j++){
                       if(templist[j].time_left<templist[j+1].time_left){
                           let temp_var= templist[j];
                           templist[j]=templist[j+1];
                           templist[j+1]= temp_var;
                       }
                   }
               }
               displayed_list=templist;
               displaylist(templist);
               return;
           }
           if(sorter.value ==='priority high'){
               for(let i=0,j=0; j<todolist.length; j++){
                   if(todolist[j].priority==='high')
                   templist[i++]= todolist[j];
                   
               }
               displayed_list=templist;
               displaylist(templist);
               return;
           }
           if(sorter.value ==='priority medium'){
               for(let i=0,j=0; j<todolist.length; j++){
                   if(todolist[j].priority==='medium')
                   templist[i++]= todolist[j];
                   
               }
               displayed_list=templist;
               displaylist(templist);
               return;
           }
           if(sorter.value ==='priority low'){
               for(let i=0,j=0; j<todolist.length; j++){
                   if(todolist[j].priority==='low')
                   templist[i++]= todolist[j];
                   
               }
               displayed_list=templist;
               displaylist(templist);
               return;
           }
           else{
               let category = sorter.value;
               console.log(category);
               for(let i=0,j=0; j<todolist.length; j++){
                   if(todolist[j].category===category)
                   templist[i++]= todolist[j];
                   
               }
               displayed_list=templist;
               displaylist(templist);
               return;
           }
       }

       function minimal_update(){
           for(let i = 0; i< todolist.length; i++){
               const todo= todolist[i];
               const [time_string, time_left] = 
               get_time_left(todo.date, todo.time);
               todo.time_string=time_string;
               todo.time_left=time_left;
               let percent= get_percent(todo.time_left, todo.max_time);
              
               todo.percent=percent;
           }
           save_data();
           for( let j =0; j<displayed_list.length;j++){
               document.querySelector(`.time${j}`).innerHTML=displayed_list[j].time_string;
               document.querySelector(`.js-progress${j}`).style.width=`${displayed_list[j].percent}%`;
           }
           for(let i = 0; i< todolist.length; i++){
               const todo= todolist[i];
               if(todo.time_string==='Due' && !todo.alert){
                   if(!isplaying && document.querySelector('.audio-selection').value!=='silent'){
                   play_audio();
                   isplaying=true;
                   }
                   document.querySelector('.message').innerHTML+=`<div>${todo.name}'s due date has passed</div>`;
                   document.querySelector('.alert').style.opacity=1;
                   document.querySelector('.alert').style.zIndex='3';


                   todo.alert=true;
                  
               }
           }

               

           }


       

       function isEqualItem(obj1, obj2){
           return (obj1.name===obj2.name && obj1.category === obj2.category && obj1.date === obj2.date && obj1.time ===obj2.time);
       }

       function delete_item(obj){
           for( let i =0; i<todolist.length;i++){
               if(isEqualItem(obj, todolist[i])){
                   todolist.splice(i,1);
                   save_data();
                   return;
               }
           }
       }

       document.querySelector('body').addEventListener('keyup', function(event){
           if(event.key==='Enter'){
               const alertElement = document.querySelector(".alert");
               const computedStyle = window.getComputedStyle(alertElement);
               const opacity = parseInt(computedStyle.getPropertyValue("opacity"));
           if(opacity)
           stop_audio();
           else
           addElement();
           }
       });