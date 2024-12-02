import { render, screen, fireEvent } from "@testing-library/react";
import { afterAll, vi, describe, test, expect } from "vitest";
import React from "react";
import { Profiler } from "react";
import App from "../src/components/Problem2";
import calculateFactorial from "../src/utils/factorial";

describe("Problem2: useMemo", () => {
    afterAll(() => {
        vi.resetAllMocks();
    });
    test("(25 points) Factorial computed only when changing value", async () => {
        const onRender = vi.fn();
        vi.mock("../src/utils/factorial", { spy: true });

        render(
            <Profiler id="AppProfiler" onRender={onRender}>
                <App />
            </Profiler>,
        );

        // Initial render
        expect(onRender).toHaveBeenCalledTimes(1);
        expect(calculateFactorial).toHaveBeenCalledTimes(1);

        const numberInput = screen.getByLabelText(
            /Enter a number/i,
        ) as HTMLInputElement;
        const renderButton = screen.getByRole("button");

        // Update input value
        fireEvent.change(numberInput, { target: { value: "12" } });
        expect(onRender).toHaveBeenCalledTimes(2);
        expect(calculateFactorial).toHaveBeenCalledTimes(2);
        expect(calculateFactorial).toHaveBeenCalledWith(12);
        expect(calculateFactorial).toHaveReturnedWith(479001600);

        // Click calculate
        fireEvent.click(renderButton);
        expect(onRender).toHaveBeenCalledTimes(3);
        expect(calculateFactorial).toHaveBeenCalledTimes(2);
        expect(calculateFactorial).toHaveBeenCalledWith(12);
        expect(calculateFactorial).toHaveReturnedWith(479001600);

        // Update input value
        fireEvent.change(numberInput, { target: { value: "15" } });
        expect(onRender).toHaveBeenCalledTimes(4);
        expect(calculateFactorial).toHaveBeenCalledTimes(3);
        expect(calculateFactorial).toHaveBeenCalledWith(15);
        expect(calculateFactorial).toHaveReturnedWith(1307674368000);

        // Click calculate
        fireEvent.click(renderButton);
        expect(onRender).toHaveBeenCalledTimes(5);
        expect(calculateFactorial).toHaveBeenCalledTimes(3);
        expect(calculateFactorial).toHaveBeenCalledWith(15);
        expect(calculateFactorial).toHaveReturnedWith(1307674368000);
    });

    test("(Additional test case 1) Factorial not computed when re-rendering without changing value", async () => {
        const onRender = vi.fn();
        vi.mock("../src/utils/factorial", { spy: true });

        render(
            <Profiler id="AppProfiler" onRender={onRender}>
                <App />
            </Profiler>,
        );

        // Initial render
        expect(onRender).toHaveBeenCalledTimes(1);
        expect(calculateFactorial).toHaveBeenCalledTimes(4);

        const renderButton = screen.getByRole("button");

        // Click calculate
        fireEvent.click(renderButton);
        expect(onRender).toHaveBeenCalledTimes(2);
        expect(calculateFactorial).toHaveBeenCalledTimes(4);

        // Click calculate again
        fireEvent.click(renderButton);
        expect(onRender).toHaveBeenCalledTimes(3);
        expect(calculateFactorial).toHaveBeenCalledTimes(4);
    });

    test("(Additional test case 2) Factorial computed correctly for different values", async () => {
        const onRender = vi.fn();
        vi.mock("../src/utils/factorial", { spy: true });

        render(
            <Profiler id="AppProfiler" onRender={onRender}>
                <App />
            </Profiler>,
        );

        const numberInput = screen.getByLabelText(
            /Enter a number/i,
        ) as HTMLInputElement;

        // Update input value to 5
        fireEvent.change(numberInput, { target: { value: "5" } });
        expect(onRender).toHaveBeenCalledTimes(2);
        expect(calculateFactorial).toHaveBeenCalledTimes(6);
        expect(calculateFactorial).toHaveBeenCalledWith(5);
        expect(calculateFactorial).toHaveReturnedWith(120);

        // Update input value to 7
        fireEvent.change(numberInput, { target: { value: "7" } });
        expect(onRender).toHaveBeenCalledTimes(3);
        expect(calculateFactorial).toHaveBeenCalledTimes(7);
        expect(calculateFactorial).toHaveBeenCalledWith(7);
        expect(calculateFactorial).toHaveReturnedWith(5040);
    });
});
