

# Manga Downloader

This TypeScript script allows you to download all pages of a manga chapter from MangaDex and compile them into a readable PDF file.

## Features

- Fetches chapter details and page URLs from MangaDex API.
- Downloads each page image and compiles them into a single PDF.
- Command-line interface for easy usage.

## Prerequisites

- Node.js installed on your machine.
- npm (Node Package Manager) to install dependencies.

## Installation

1. Clone or download this repository to your local machine.

2. Navigate to the project directory in your terminal.

3. Install dependencies using npm:

   ```bash
   npm install
   ```

## Usage

Run the script with the following command:

```bash
node mangaDownloader.js --chapter-id <chapterId> [--output <outputFilename>]
```

Replace `<chapterId>` with the actual MangaDex chapter ID you want to download. Optionally, specify `--output <outputFilename>` to customize the output PDF filename (default is `output.pdf`).

### Example

To download chapter `05b9c999-651a-4792-b053-fb8fc0dd863a`:

```bash
node mangaDownloader.js --chapter-id 05b9c999-651a-4792-b053-fb8fc0dd863a
```

To specify a custom output filename:

```bash
node mangaDownloader.js --chapter-id 05b9c999-651a-4792-b053-fb8fc0dd863a --output my_chapter.pdf
```

## Notes

- The script assumes access to the MangaDex API. Ensure you have internet access and the API is accessible.
- Depending on your network speed and MangaDex server response times, downloading may take some time.
- Error handling is implemented to manage common issues such as network errors or invalid chapter IDs.

## Dependencies

- axios: for making HTTP requests to MangaDex API.
- image-downloader: for downloading images from URLs.
- pdf-lib: for creating PDF documents programmatically.
- commander: for parsing command-line arguments.

## Contributing

Feel free to contribute to this project. Fork the repository, make improvements, and submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
