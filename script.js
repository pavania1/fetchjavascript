// script.js
document.addEventListener('DOMContentLoaded', loadData);

function performGetRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var responseData = JSON.parse(xhr.responseText);
      callback(null, responseData);
    } else {
      callback('Error: ' + xhr.status, null);
    }
  };
  xhr.send();
}
var Posts;
function loadData() {
  var url = 'https://jsonplaceholder.typicode.com/posts';
  performGetRequest(url, function(error, responseData) {
    if (error) {
      console.error(error);
    } else {
       Posts=responseData;
      getAllPosts();      
    }
  });
}
function getAllPosts() {
 displayPosts(Posts);
}

function getPostById() {
  let postIdInput = document.getElementById('postIdInput');
  let postId = postIdInput.value;
  console.log(typeof postId);
  // var url = 'https://jsonplaceholder.typicode.com/posts/' + postId;
  // performGetRequest(url, function(error, responseData) {
    // if (error) {
      // console.error(error);
    // } else {
      // if (responseData.id) {
      if (Posts.filter(x=>x.id===parseInt(postId)).length>0) {
        // console.log(Posts[postId-1]);
        displayPosts(Posts.filter(x=>x.id===parseInt(postId)));
      } else {
        console.log('Post not found.');
      }
    }
  // });
// }
var currentPage = 1; // Global variable to keep track of the current page
var postsPerPage = 5; // Number of posts to display per page

function displayPosts(posts) {
  var tableBody = document.querySelector('#postsTable tbody');
  tableBody.innerHTML = '';

  var startIndex = (currentPage - 1) * postsPerPage;
  var endIndex = startIndex + postsPerPage;
  var paginatedPosts = posts?.slice(startIndex, endIndex);

  paginatedPosts?.forEach(function(post) {
    var row = document.createElement('tr');
    var idCell = document.createElement('td');
    var userIdCell = document.createElement('td');
    var titleCell = document.createElement('td');
    var bodyCell = document.createElement('td');
    var editCell = document.createElement('td');
    var deleteCell = document.createElement('td');

    idCell.innerText = post.id;
    userIdCell.innerText = post.userId;
    titleCell.innerText = post.title;
    bodyCell.innerText = post.body;

    var editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', function() {
      editPost(post.id);
    });

    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function() {
      deletePost(post.id);
    });

    editCell.appendChild(editButton);
    deleteCell.appendChild(deleteButton);

    row.appendChild(idCell);
    row.appendChild(userIdCell);
    row.appendChild(titleCell);
    row.appendChild(bodyCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);
  });

  displayPagination(posts?.length);
}

function searchPosts() {
  var searchInput = document.getElementById('searchInput');
  var searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm === '') {
    displayPosts(Posts);
    return;
  }

  var filteredPosts = Posts.filter(function(post) {
    return post.userId.toString() === searchTerm;
  });

  displayPosts(filteredPosts);
}


function displayPagination(totalPosts) {
  var totalPages = Math.ceil(totalPosts / 5);
  var paginationContainer = document.querySelector('#pagination');
  paginationContainer.innerHTML = '';

  for (var i = 1; i <= totalPages; i++) {
    var pageButton = document.createElement('button');
    pageButton.innerText = i;
    pageButton.addEventListener('click', function() {
      currentPage = parseInt(this.innerText);
      displayPosts(Posts);
    });

    paginationContainer.appendChild(pageButton);
  }
}

function editPost(postId) {
  var updatePostFormContainer = document.getElementById('editPostFormContainer');
  updatePostFormContainer.style.display ='block';
  var post = Posts.find(function(item){
    return item.id === postId;
  });
  if (!validateTitle("editTitle", "msg1")){
    return ;

  }
  if (!validateBody("editBody","msg4")) {
    return;
  }
  if (post) {
    var postIdInput = document.getElementById('editPostId');
    var userIdInput = document.getElementById('editUserId');
    var titleInput = document.getElementById('editTitle');
    var bodyInput = document.getElementById('editBody');
    
    
    postIdInput.value =post.id;
    userIdInput.value = post.userId;
    titleInput.value = post.title;
    bodyInput.value = post.body;
  }else {
    console.log('Post not found');
  }
}

function deletePost(postId) {
  Posts = Posts.filter(function(post){
    return post.id !== postId;
  });
  displayPosts(Posts);
}

function showCreatePostForm() {
  var createPostFormContainer = document.getElementById('createPostFormContainer');
  createPostFormContainer.style.display = 'block';
}
// function showUpdatePostForm() {
//   var updatePostFormContainer = document.getElementById('updatePostFormContainer');
//   updatePostFormContainer.style.display = 'block';
// }
function showEditPostForm() {
  var editPostFormContainer = document.getElementById('editPostFormContainer');
  editPostFormContainer.style.display = 'block';
}

function createPost(event) {
   event.preventDefault();
  console.log()
  if(!validateTitle("title", "msg")) {
    return;
  }
  if (!validateBody("body","msg3")) {
    return;
  }

  var postId = document.getElementById('postId').value;
  var userId = document.getElementById('userId').value;
  var title = document.getElementById('title').value;
  var body = document.getElementById('body').value;
  console.log(userId, title, body);

  let post = {
    id: parseInt(postId),
    userId: parseInt(userId),
    title: title,
    body: body
  };
  // Posts.push(post);
  // Posts.sort((a,b)=>(a.id-b.id));
  // getAllPosts();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if (xhr.status === 201) {
        var createdPost = JSON.parse(xhr.responseText);
      console.log('Created Post:', createdPost);
      displayNewPost(createdPost); // Display the new post in the table
      resetCreatePostForm();
    } else {
      console.error('Error: ' + xhr.status);
    }
  };
  xhr.send(JSON.stringify(post));
}
function updatePost(event) {
  //console.log("called...")
  event.preventDefault();
  delById();
  var postId = document.getElementById('editPostId').value;
  var userId = document.getElementById('editUserId').value;
  var title = document.getElementById('editTitle').value;
  var body = document.getElementById('editBody').value;

  console.log(postId,userId, title, body)
  let post = {
    id: parseInt(postId),
    userId: parseInt(userId),
    title: title,
    body: body
  };
  Posts.push(post);
  Posts.sort((a,b)=>(a.id-b.id));
  getAllPosts();
  // var xhr = new XMLHttpRequest();
  // xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts', true);
  // xhr.setRequestHeader('Content-Type', 'application/json');
  // xhr.onload = function() {
  //   if (xhr.status === 201) {
  //     var createdPost = JSON.parse(xhr.responseText);
  //     console.log('Created Post:', createdPost);
  //     displayNewPost(createdPost); // Display the new post in the table
  //     resetCreatePostForm();
  //   } else {
  //     console.error('Error: ' + xhr.status);
  //   }
  // };
  // xhr.send(JSON.stringify(post));
}

function displayNewPost(post) {
  var tableBody = document.querySelector('#postsTable tbody');

  var row = document.createElement('tr');
  var idCell = document.createElement('td');
  var userIdCell = document.createElement('td');
  var titleCell = document.createElement('td');
  var bodyCell = document.createElement('td');

  idCell.innerText = post.id;
  userIdCell.innerText = post.userId;
  titleCell.innerText = post.title;
  bodyCell.innerText = post.body;

  row.appendChild(idCell);
  row.appendChild(userIdCell);
  row.appendChild(titleCell);
  row.appendChild(bodyCell);
  tableBody.appendChild(row);
}

function resetCreatePostForm() {
  var createPostForm = document.getElementById('createPostForm');
  createPostForm.reset();
}
const clearTable=()=>{
  Posts=[];
  displayPosts();
}
function delById() {
  let postIdInput = document.getElementById('editPostId');
  let postId = postIdInput.value;

  // var url = 'https://jsonplaceholder.typicode.com/posts/' + postId;
  // performGetRequest(url, function(error, responseData) {
    // if (error) {
      // console.error(error);
    // } else {
      // if (responseData.id) {
      if (Posts.filter(x=>x.id===parseInt(postId)).length>0) {
        // console.log(Posts[postId-1]);
        displayPosts(Posts=Posts.filter(x=>x.id!==parseInt(postId)));
      } else {
        console.log('Post not found to be deleted.');
      }
    }
  // });
// }


function validateTitle(titleId, msgId) {
  const titleEle = document.getElementById(titleId);
  if(titleEle.value.length > 100000) {
  document.getElementById(msgId).innerHTML ="Maximum number of characters allowed into the text field is onelakh";
  return 0;
  }
  return 1;
}

function validateBody(bodyId,msgId) {
  const bodyEle = document.getElementById(bodyId);
  if (bodyEle.value.length >100000) {
    document.getElementById(msgId).innerHTML = "Maximum number of characters allowed into the text field is onelakh";
    return 0;
  }
  return 1;
}

