import React, { useState } from 'react'
import { ChromePicker, ColorResult, RGBColor } from 'react-color'

export type SettingOptions = {
	fontSize: number // postfix px
	lineHeight: number
	letterSpacing: number // postfix px
	color: ColorResult
	backgroundColor: ColorResult
}

type OptionKey = keyof SettingOptions

const black: ColorResult = {
	hsl: { h: 0, s: 0, l: 0, a: 1 },
	hex: '#000000',
	rgb: { r: 0, g: 0, b: 0, a: 1 },
}

const white: ColorResult = {
	hsl: { h: 0, s: 0, l: 1, a: 1 },
	hex: '#ffffff',
	rgb: { r: 255, g: 255, b: 255, a: 1 },
}

export const defaultSetting: SettingOptions = {
	fontSize: 16,
	lineHeight: 1.2,
	letterSpacing: 0.032,
	color: black,
	backgroundColor: white,
}

export default function SettingPopup({
	setting,
	setSetting,
}: {
	setting: SettingOptions
	setSetting: React.Dispatch<React.SetStateAction<SettingOptions>>
}) {
	const [show, setShow] = useState(false)

	const setOption = (key: OptionKey, val: any) =>
		setSetting(setting => ({
			...setting,
			[key]: val,
		}))

	const changeHandler =
		(key: OptionKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
			let val = e.target.value
			setOption(key, val)
		}

	const inputStyle = {
		borderColor: setting.color.hex,
		color: setting.color.hex,
		backgroundColor: setting.backgroundColor.hex,
	}

	return !show ? (
		<button onClick={() => setShow(true)} style={inputStyle}>
			Setting
		</button>
	) : (
		<div>
			<div>
				<label>大小：</label>
				<input
					type="range"
					value={setting.fontSize}
					onChange={changeHandler('fontSize')}
					min={1}
					max={72}
					style={inputStyle}
				/>
				<input
					type="number"
					value={setting.fontSize}
					onChange={changeHandler('fontSize')}
					min={1}
					max={72}
					style={inputStyle}
				/>
				<label>px</label>
			</div>
			<div>
				<label>行高：</label>
				<input
					type="range"
					value={setting.lineHeight}
					onChange={changeHandler('lineHeight')}
					min={0}
					max={2}
					step={0.1}
					style={inputStyle}
				/>
				<input
					type="number"
					value={setting.lineHeight}
					onChange={changeHandler('lineHeight')}
					min={0}
					max={2}
					step={0.1}
					style={inputStyle}
				/>
			</div>
			<div>
				<label>行距：</label>
				<input
					type="range"
					value={setting.letterSpacing}
					onChange={changeHandler('letterSpacing')}
					min={-10}
					max={10}
					style={inputStyle}
				/>
				<input
					type="number"
					value={setting.letterSpacing}
					onChange={changeHandler('letterSpacing')}
					min={-10}
					max={10}
					style={inputStyle}
				/>
				<label>px</label>
			</div>
			<div>
				<label>文字顏色：</label>
				<ColorPicker
					color={setting.color}
					setColor={color => setOption('color', color)}
				/>
			</div>
			<div>
				<label>背景顏色：</label>
				<ColorPicker
					color={setting.backgroundColor}
					setColor={color => setOption('backgroundColor', color)}
				/>
			</div>
			<button onClick={() => setShow(false)} style={inputStyle}>
				Close
			</button>
		</div>
	)
}

function ColorPicker({
	color,
	setColor,
}: {
	color: ColorResult
	setColor: React.Dispatch<React.SetStateAction<ColorResult>>
}) {
	const [show, setShow] = useState(false)

	// https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
	const brightness = (color: RGBColor) =>
		Math.round((color.r * 299 + color.g * 587 + color.b * 114) / 1000)

	return (
		<>
			<button
				onClick={() => setShow(show => !show)}
				style={{
					backgroundColor: color.hex,
					color: brightness(color.rgb) > 125 ? 'black' : 'white',
				}}
			>
				Pick Color: {color.hex}
			</button>
			{show ? (
				<div
					style={{
						position: 'absolute',
						zIndex: '2',
					}}
				>
					<div
						style={{
							position: 'fixed',
							top: '0px',
							right: '0px',
							bottom: '0px',
							left: '0px',
						}}
						onClick={() => setShow(false)}
					/>
					<ChromePicker color={color.hex} onChange={setColor} />
				</div>
			) : null}
		</>
	)
}
