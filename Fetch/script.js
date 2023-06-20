document.addEventListener('DOMContentLoaded', loadData);

function performRequest(url, method, data, callback) {
  var requestOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  fetch(url, requestOptions)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error: ' + response.status);
      }
    })
    .then(function(responseData) {
      callback(null, responseData);
    })
    .catch(function(error) {
      callback(error, null);
    });
}

var Posts;

function loadData() {
  var url = 'https://jsonplaceholder.typicode.com/posts';
  performRequest(url, 'GET', null, function(error, responseData) {
    if (error) {
      console.error(error);
    } else {
      Posts = responseData;
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

  if (Posts.filter(x => x.id === parseInt(postId)).length > 0) {
    displayPosts(Posts.filter(x => x.id === parseInt(postId)));
  } else {
    console.log('Post not found.');
  }
}

var currentPage = 1;
var postsPerPage = 5;

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
  var totalPages = Math.ceil(totalPosts / postsPerPage);
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
  updatePostFormContainer.style.display = 'block';
  var post = Posts.find(function(item) {
    return item.id === postId;
  });
  if (!validateTitle('editTitle', 'msg1')) {
    return;
  }
  if (!validateBody('editBody', 'msg4')) {
    return;
  }
  if (post) {
    var postIdInput = document.getElementById('editPostId');
    var userIdInput = document.getElementById('editUserId');
    var titleInput = document.getElementById('editTitle');
    var bodyInput = document.getElementById('editBody');

    postIdInput.value = post.id;
    userIdInput.value = post.userId;
    titleInput.value = post.title;
    bodyInput.value = post.body;
  } else {
    console.log('Post not found');
  }
}

function deletePost(postId) {
  Posts = Posts.filter(function(post) {
    return post.id !== postId;
  });
  displayPosts(Posts);
}

function showCreatePostForm() {
  var createPostFormContainer = document.getElementById('createPostFormContainer');
  createPostFormContainer.style.display = 'block';
}

function createPost(event) {
  event.preventDefault();

  if (!validateTitle('title', 'msg')) {
    return;
  }
  if (!validateBody('body', 'msg3')) {
    return;
  }

  var postId = document.getElementById('postId').value;
  var userId = document.getElementById('userId').value;
  var title = document.getElementById('title').value;
  var body = document.getElementById('body').value;

  let post = {
    id: parseInt(postId),
    userId: parseInt(userId),
    title: title,
    body: body
  };

  var url = 'https://jsonplaceholder.typicode.com/posts';
  performRequest(url, 'POST', post, function(error, responseData) {
    if (error) {
      console.error(error);
    } else {
      console.log('Created Post:', responseData);
      displayNewPost(responseData);
      resetCreatePostForm();
    }
  });
}

function updatePost(event) {
  event.preventDefault();

  var postId = document.getElementById('editPostId').value;
  var userId = document.getElementById('editUserId').value;
  var title = document.getElementById('editTitle').value;
  var body = document.getElementById('editBody').value;

  console.log(postId, userId, title, body);

  let post = {
    //id: parseInt(postId),
    userId: parseInt(userId),
    title: title,
    body: body
  };

  var url = 'https://jsonplaceholder.typicode.com/posts/' + postId;
  performRequest(url, 'PUT', post, function(error, responseData) {
    if (error) {
      console.error(error);
    } else {
      console.log('Updated Post:', responseData);
      getAllPosts();
    }
  });
}
fetch ('https://jsonplaceholder.typicode.com/posts/' + postId,{
    method: 'PUT',
    headers: {
        'Content-Type' : 'application/json'
    },
    body: JSON.stringify(post)
})
.then(response => response.json())
.then(data =>{
    console.log(data);
})
.catch(error => {
    console.error(error);
});


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
  document.getElementById('postId').value = '';
  document.getElementById('userId').value = '';
  document.getElementById('title').value = '';
  document.getElementById('body').value = '';
  var createPostFormContainer = document.getElementById('createPostFormContainer');
  createPostFormContainer.style.display = 'none';
}

function resetEditPostForm() {
  var updatePostFormContainer = document.getElementById('editPostFormContainer');
  updatePostFormContainer.style.display = 'none';
}

function cancelCreatePost() {
  resetCreatePostForm();
}

function cancelEditPost() {
  resetEditPostForm();
}
function showEditPostForm() {
    document.getElementById("editPostFormContainer").style.display ="block";
}

function validateTitle(titleId, msgId) {
  var titleInput = document.getElementById(titleId);
  var title = titleInput.value.trim();

  var msg = document.getElementById(msgId);

  if (title === '') {
    msg.innerText = 'Title is required';
    titleInput.classList.add('is-invalid');
    return false;
  } else {
    msg.innerText = '';
    titleInput.classList.remove('is-invalid');
    return true;
  }
}

function validateBody(bodyId, msgId) {
  var bodyInput = document.getElementById(bodyId);
  var body = bodyInput.value.trim();

  var msg = document.getElementById(msgId);

  if (body === '') {
    msg.innerText = 'Body is required';
    bodyInput.classList.add('is-invalid');
    return false;
  } else {
    msg.innerText = '';
    bodyInput.classList.remove('is-invalid');
    return true;
  }
}
