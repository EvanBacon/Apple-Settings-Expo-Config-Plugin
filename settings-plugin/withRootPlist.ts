import {
  BaseMods,
  ConfigPlugin,
  createRunOncePlugin,
  Mod,
  withMod,
} from "@expo/config-plugins";
import * as plist from "@expo/plist";
import * as fs from "fs";
import path from "path";

/** Indicates that the element is displayed only on specific types of devices. The value of this key is an array of strings with the supported idioms. Include the string “Phone” to display the element on iPhone and iPod touch. Include the string to “Pad” to display it on iPad. */
export type UserInterfaceIdiom = "Pad" | "Phone";

type PreferenceSpecifier = {
  /** Indicates that the element is displayed only on specific types of devices. The value of this key is an array of strings with the supported idioms. Include the string “Phone” to display the element on iPhone and iPod touch. Include the string to “Pad” to display it on iPad. */
  SupportedUserInterfaceIdioms?: UserInterfaceIdiom[];
};

/** https://developer.apple.com/library/archive/documentation/PreferenceSettings/Conceptual/SettingsApplicationSchemaReference/RevisionHistory.html#//apple_ref/doc/uid/TP40007071-CH2-SW1 */
export type SettingsPlist = {
  /** The name of the strings file associated with this schema file. A copy of this file (with appropriate localized strings) should be located in each of your bundle’s language-specific project directories. If you do not include this key, the strings in this schema file are not localized. For information on creating strings files, see Internationalization and Localization Guide. */
  StringsTable?: string;
  /**
   * The app group identifier to use for storing preference values. Specify this key when you want preferences to be stored in a container other than the one used by your iOS app. For example, specify this key when creating a WatchKit settings bundle so that the WatchKit extension can access the preferences.
   * Enable the App Groups capability for each executable that needs to access the shared preferences. The group you select should match the value of this key. To access preferences stored in the group, pass the value of this key to the initWithSuiteName: method of your NSUserDefaults object.
   * This key is supported in iOS 8.2 and later.
   */
  ApplicationGroupContainerIdentifier?: string;
  /** An array of dictionaries, each of which contains the data for a single preference element. The order of the elements in the array defines the order that they are displayed on the screen. */
  PreferenceSpecifiers: ((
    | {
        // https://developer.apple.com/library/archive/documentation/PreferenceSettings/Conceptual/SettingsApplicationSchemaReference/Articles/PSGroupSpecifier.html#//apple_ref/doc/uid/TP40007009-SW1
        Type: "PSGroupSpecifier";
        /** The title of the group. If you do not specify this key, a gap is inserted between preferences. The value of this key is localizable. */
        Title?: string;
        /** Additional text to display below the group box. Providing a footer is optional. The value of this key is localizable. On tvOS, the additional text is limited to 5 lines. */
        FooterText?: string;
      }
    | {
        // https://developer.apple.com/library/archive/documentation/PreferenceSettings/Conceptual/SettingsApplicationSchemaReference/Articles/PSTextFieldSpecifier.html
        /** A text field preference. This element displays an optional title and an editable text field. You can use this type for preferences that require the user to specify a custom string value. For more information, see Text Field Element. */
        Type: "PSTextFieldSpecifier";
        /** The string displayed to the left of the text field’s value. This string is drawn left aligned and in bold face. If you omit this key, the editable text field spans the width of the row. */
        Title?: string;
        /** The preference key with which to associate the value. This is the string you use this to retrieve the preference value in your code. */
        Key: string;
        /** The default value for the preference key. This value is returned when the specified preferences key (represented by the Key entry) is not present in the preferences database. If this key is not present, an empty string is associated with the key. */
        DefaultValue?: string;
        /** If Yes, the text field is a password-entry text field, which replaces the typed text with bullet characters. If No, the text field is a standard text field that displays the typed text. If this key is not present, the default is No. */
        IsSecure?: boolean;
        /** The type of keyboard to display to the user. This value must contain one of the following strings: Alphabet , NumbersAndPunctuation , NumberPad , URL , EmailAddress.
         * @default "Alphabet"
         */
        KeyboardType?: "Alphabet" | string;
        /** The auto-capitalization style to apply to typed text. This value must contain one of the following strings: None , Sentences , Words , AllCharacters.
         * @default "None"
         */
        AutocapitalizationType?: "None" | string;
        /** The auto-correction style to apply when typing. This value must contain one of the following strings: Default , No , Yes.
         * @default "Default"
         */
        AutocorrectionType: "Default" | "No" | string;
      }
    | {
        /** This element displays an ON/OFF button that can be toggled by the user. */
        Type: "PSToggleSwitchSpecifier";
        /** The string displayed to the left of the switch. */
        Title: string;
        /** The preference key identifying the value. This is the string you use this to retrieve the preference value from the defaults database. */
        Key: string;
        /** The default value for the preference key. This value is returned when the specified preferences key (represented by the Key entry) is not present in the defaults database. */
        DefaultValue: any;

        /** The value associated with the preference when the toggle switch is in the ON position. The value type for this key can be any scalar type, including `boolean`, `string`, `number`, `Date`, or Data. If this key is not present, the default value type is a `boolean` with the value `true`. */
        TrueValue?: any;

        /** The value associated with the preference when the toggle switch is in the OFF position. The value type for this key can be any scalar type, including `boolean`, `string`, `number`, `Date`, or Data. If this key is not present, the default value type is a `boolean` with the value `false`. */
        FalseValue?: any;
      }
    | {
        /** This element displays a slider that you can use to specify a continuous range of values for the user. Note: Sliders are not supported on tvOS. */
        Type: "PSSliderSpecifier";
        /** The preference key identifying the value. This is the string you use this to retrieve the preference value from the defaults database. */
        Key: string;
        /** The default value for the preference key. This value is returned when the specified preferences key (represented by the Key entry) is not present in the preferences database. */
        DefaultValue: number;
        /** The minimum value for the slider. */
        MinimumValue: number;
        /** The maximum value for the slider. */
        MaximumValue: number;
        /** The image to display on the side of the slider representing the minimum value. This image should be 21 by 21 pixels. */
        MinimumValueImage?: string;
        /** The image to display on the side of the slider representing the maximum value. This image should be 21 by 21 pixels. */
        MaximumValueImage?: string;
      }
    | {
        // This element displays a preferences row, that when tapped loads a new page of preferences. You can use this element type to build hierarchical pages of preferences.
        Type: "PSChildPaneSpecifier";
        /** The title string displayed in the preference row. This is the string the user taps to display the next page. This string is also used as the title of the screen that is subsequently displayed. */
        Title: string;
        /** The name of the schema file to load. (This file must be a property list file.) The string you specify for this key should not contain path information or the .plist filename extension of your schema file. The Settings app looks in the top-level of your settings bundle for a .plist file with the specified name. For example, if you had a MyPrefs.plist file, you would assign the value MyPrefs to this key. This key is required. */
        File: string;
      }
    | {
        // https://developer.apple.com/library/archive/documentation/PreferenceSettings/Conceptual/SettingsApplicationSchemaReference/Articles/PSTitleValueSpecifier.html#//apple_ref/doc/uid/TP40007015-SW1
        /** This element represents a read-only preference. You can use it to provide the user with information about your app’s configuration. The Values and Titles keys let you associate human-readable strings with values in the defaults database that might otherwise be considered cryptic. The number of entries in both arrays must be equal. When a value at a given index is associated with the preference key, the string at the same index in the Titles array is displayed for the preference by the Settings app. */
        Type: "PSTitleValueSpecifier";
        /**
         * The string displayed to the left of the value.
         * @localizable
         */
        Title?: string;
        /** The preference key identifying the value. This is the string you use this to retrieve the preference value from the defaults database. */
        Key: string;
        /** The default value for the preference key. This value is returned when the specified preferences key (represented by the Key entry) is not present in the preferences database. */
        DefaultValue: string;
        /** An array of the values that could be associated with the preference key (Key entry) in the defaults database. These values can be of any type. Each value should have a corresponding value in the Titles array. */
        Values?: string[];
        /**
         * An array of strings that represent user-readable versions of the values in the Values array.
         * @localizable
         */
        Titles?: string[];
      }
    | {
        // https://developer.apple.com/library/archive/documentation/PreferenceSettings/Conceptual/SettingsApplicationSchemaReference/Articles/PSMultiValueSpecifier.html#//apple_ref/doc/uid/TP40007016-SW1
        /** When the user taps a preference containing a multi-value element, the Settings app displays a new page with the possible values to choose from. Upon selecting a value, the user is returned to the previous page, and the selected value is displayed in the preference row. */
        Type: "PSMultiValueSpecifier";

        /** The user-readable string identifying the preference. */
        Title: string;
        /** The preference key with which to associate the value. This is the string you use this to retrieve the preference value in your code. */
        Key: string;
        /** The default value for the preference key. This value is returned when the specified preferences key (represented by the Key entry) is not present in the preferences database. */
        DefaultValue: any;
        /** An array of the values that could be associated with the preference key (Key entry) in the defaults database. These values can be of any type. Each value should have a corresponding value in the Titles array. */
        Values: any[];
        /** An array of strings that represent user-readable versions of the values in the Values array. These are the strings that are actually displayed on the selection page. When a string is selected, the value at the matching index is stored in the defaults database. */
        Titles: string[];
        /** An array of strings that are abbreviated versions of the strings in the Titles array. When this key is included, the preference row uses the strings in the corresponding array instead of the strings in the Titles array. (The preference row shows the title of the preference and the currently selected value.) The longer strings in the Titles array are still displayed in the new page presented to the user. */
        ShortTitles?: string[];
        /** If Yes, the values are displayed in the localized sort order of the Titles array. */
        DisplaySortedByTitle?: boolean;
      }
    | {
        // https://developer.apple.com/library/archive/documentation/PreferenceSettings/Conceptual/SettingsApplicationSchemaReference/Articles/RadioGroupElement.html#//apple_ref/doc/uid/TP30915196-SW2
        /** This type defines a radio group element, which provides two or more choices of which only one at a time can be selected. */
        Type: "PSRadioGroupSpecifier";

        /**
         * The title of the group. If you do not specify this key, a gap is inserted between preferences.
         * @localizable
         */
        Title?: string;
        /**
         * Additional text to display below the group box. Providing a footer is optional.
         * @localizable
         */
        FooterText?: string;
        /** The preference key with which to associate the value. This is the string you use this to retrieve the preference value in your code. */
        Key: string;
        /** The default value for the preference key. This value is returned when the specified preferences key (represented by the Key entry) is not present in the preferences database. */
        DefaultValue: any;
        /** An array of the values that could be associated with the preference key (Key entry) in the defaults database. These values can be of any type. Each value should have a corresponding value in the Titles array. */
        Values: any[];
        /**
         * An array of strings that represent user-readable versions of the values in the Values array. These are the strings that are actually displayed on the selection page. When a string is selected, the value at the matching index is stored in the defaults database.
         * @localizable
         */
        Titles: string[];
        /** If Yes, the values are displayed in the localized sort order of the Titles array. */
        DisplaySortedByTitle?: boolean;
      }
  ) &
    PreferenceSpecifier)[];
};

export function createModSetForSettingsPage({
  name = "Root",
}: { name?: string } = {}) {
  const customModName = "settings" + name + "Plist";

  const withSettingsPlist: ConfigPlugin<Mod<SettingsPlist>> = (
    config,
    action
  ) => {
    return withMod(config, {
      platform: "ios",
      mod: customModName,
      action,
    });
  };

  const withRootPlistBaseModInternal: ConfigPlugin = (config) => {
    return BaseMods.withGeneratedBaseMods(config, {
      platform: "ios",
      saveToInternal: true,
      skipEmptyMod: false,
      providers: {
        [customModName]: BaseMods.provider<SettingsPlist>({
          isIntrospective: true,

          async getFilePath({ modRequest, _internal }) {
            return path.join(
              modRequest.platformProjectRoot,
              modRequest.projectName!,
              `Settings.bundle/${name}.plist`
            );
          },
          async read(filePath) {
            try {
              if (fs.existsSync(filePath) === false) {
                return {
                  PreferenceSpecifiers: [],
                };
              }
              return plist.default.parse(
                await fs.promises.readFile(filePath, "utf-8")
              );
            } catch (error) {
              throw new Error(
                `Failed to parse the iOS Settings.bundle/${name}.plist: "${filePath}". ${error.message}}`
              );
            }
          },
          async write(filePath, { modResults, modRequest: { introspect } }) {
            if (introspect) {
              return;
            }
            const contents = plist.default.build(modResults);
            // Ensure Settings.bundle
            await fs.promises.mkdir(path.dirname(filePath), {
              recursive: true,
            });
            await fs.promises.writeFile(filePath, contents);
          },
        }),
      },
    });
  };

  const baseName = `withAppleSettings${name}PlistBaseMod`;

  return {
    withSettingsPlist,
    withBaseMod: createRunOncePlugin(withRootPlistBaseModInternal, baseName),
  };
}
