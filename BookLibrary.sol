pragma solidity >=0.7.0 <0.9.0;
pragma abicoder v2;

import "./Ownable.sol";

contract BookLibrary is Ownable {

    event LogStateBookAdded(uint bookId, string title);
    event LogStateBookBorrowed(uint bookId, address person);
    event LogStateBookReturned(uint bookId, address person);

    struct Book {
        string title;
        uint8 bookCopiesCount;
    }

    uint availableBookCount = 0;
    Book[] books;
    mapping (bytes32 => bool) PersonBookToIsBookBorrowed;
    mapping (uint => address[]) BookToPersons;

    function addBook(string calldata _title, uint8 _bookCopiesCount) external onlyOwner {
        books.push(Book(_title, _bookCopiesCount));
        availableBookCount++;

        uint id = books.length - 1;
        emit LogStateBookAdded(id, books[id].title);
    }

    function borrowBook(uint _bookId) external bookExists(_bookId) haveAvailableBooks {
        require(books[_bookId].bookCopiesCount > 0, "No copies left.");
        bytes32 personBook = keccak256(abi.encodePacked(msg.sender, abi.encodePacked(_bookId)));
        require(PersonBookToIsBookBorrowed[personBook] == false, "You already borrowed this book.");
        
        PersonBookToIsBookBorrowed[personBook] = true;
        books[_bookId].bookCopiesCount--;
        BookToPersons[_bookId].push(msg.sender);

        if (books[_bookId].bookCopiesCount == 0) {
            availableBookCount--;
        }

        emit LogStateBookBorrowed(_bookId, msg.sender);
    }

    function returnBook(uint _bookId) external bookExists(_bookId) {
        bytes32 personBook = keccak256(abi.encodePacked(msg.sender, abi.encodePacked(_bookId)));
        require(PersonBookToIsBookBorrowed[personBook] == true, "You didn't borrow this book.");

        PersonBookToIsBookBorrowed[personBook] = false;

        if (books[_bookId].bookCopiesCount == 0) {
            availableBookCount++;
        }

        books[_bookId].bookCopiesCount++;

        emit LogStateBookReturned(_bookId, msg.sender);
    }

    function getBookRecipients(uint _bookId) external view returns(address[] memory)  {
        return BookToPersons[_bookId];
    }

    function getAvailableBookIds() external haveAvailableBooks view returns(uint[] memory)  {
        uint[] memory availableBookIds = new uint[](availableBookCount);

        uint counter = 0;
        for (uint bookId = 0; bookId < books.length; bookId++) {
            if (books[bookId].bookCopiesCount > 0) {
                availableBookIds[counter] = bookId;
                counter++;
            }
        }

        return availableBookIds;
    }

    modifier bookExists(uint _bookId) {
        require(_bookId < books.length, "The book is not found.");
        _;
    }

    modifier haveAvailableBooks() {
        require(availableBookCount > 0, "No books available.");
        _;
    }
}