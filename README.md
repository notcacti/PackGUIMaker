# CactiGUIMaker

Welcome to the **CactiGUIMaker** repository! This project is a Node.js application written in TypeScript. It has been compiled into a binary for easy distribution, and the code remains fully open source under the Mozilla Public License 2.0 (MPL-2.0).

## Overview

**CactiGUIMaker** is a powerful tool designed to streamline the process of generating UI images for designers. With this program, you can easily upload a **Java** or **Bedrock** pack (`.zip` or `.mcpack` file), and it will automatically produce a small UI PNG based on your specifications. This feature saves designers significant time by eliminating the need for manual UI creation and adjustments. It's an efficient solution to quickly generate professional-quality UI images for your projects.

## Author(s)

-   [@notcacti](https://github.com/notcacti)

## Contributor(s)

-   [@oJezler-Git](https://github.com/oJezler-git)

## Features

-   **Version Control**: This program works with both Java & Bedrock Packs.
-   **Customization**: XP Bar Fill value can be customized.
-   **Upscaling**: Upscale the generated UI to upto 10x!

## Installation

To get started with **CactiGUIMaker**, follow these steps:

### From Source

1. **Clone the Repository**

    ```bash
    git clone https://github.com/notcacti/PackGUIMaker.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd PackGUIMaker
    ```

3. **Install Dependencies**

    ```bash
    npm install
    ```

4. **Build the Application**

    ```bash
    npm run build
    ```

5. **Run the Application**

    ```bash
    npm start
    ```

### From Releases

If you prefer to download a precompiled binary:

1. **Go to the [Releases](https://github.com/notcacti/PackGUIMaker/releases) Section**

    Navigate to the [Releases](https://github.com/notcacti/PackGUIMaker/releases) page on GitHub.

2. **Download the Latest Release**

    Download the appropriate binary for your operating system from the latest release.

3. **Run the Application**

    - On **Windows**, double-click the executable file.
    - On **macOS**, open the `.app` file from the extracted folder.
    - On **Linux**, you might need to grant execute permissions with `chmod +x <filename>` and then run the executable.

## Usage

1. **Set the `Upscale` and `XP` Values**

    - Use the sliders to adjust the `upscale` and `xp` values. The values will be displayed in the respective input fields.

2. **Select a Version**

    - Click on the version buttons to select the desired version. The active version will be highlighted.

3. **Upload a `.zip` or `.mcpack` File**

    - Click the "Upload" button to open the file picker dialog.
    - Select a pack from your local filesystem.
    - The application will process the file and generate a UI image based on the selected settings and uploaded file.
    - The resulting image will be automatically downloaded to your device.

## Acknowledgements

We would like to extend our sincere thanks to the following individuals and/or organizations for their support and contributions to the **CactiGUIMaker** project:

-   **[Jezler's Original Python Software](https://github.com/oJezler-git/gui_maker):** I was inspired by [this](https://github.com/oJezler-git/gui_maker) python program which made me start **CactiGUIMaker**, Jezler also helped me with the application interface because mine sucked lol.

### Special Thanks

We also want to acknowledge the open-source community and the developers of various libraries and tools that have made this project possible. Your hard work and dedication are greatly appreciated.

> If you have contributed to the project and are not listed, please let us know so we can acknowledge your efforts. Thank you!

## License

This project is licensed under the [Mozilla Public License 2.0 (MPL-2.0)](https://opensource.org/licenses/MPL-2.0).

## Support

For any issues or questions, please open an issue on the [GitHub repository](https://github.com/notcacti/PackGUIMaker/issues).
